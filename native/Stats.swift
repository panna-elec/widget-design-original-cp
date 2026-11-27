import Foundation
import Darwin
import IOKit.ps
import SystemConfiguration

// Only generic transport types leave this process. No service/device names,
// addresses, SSIDs or USB properties are read or emitted.
func connectionKind(_ interfaceType: String?, usb: Bool?) -> String {
    if interfaceType == (kSCNetworkInterfaceTypeIEEE80211 as String) { return "wifi" }
    if interfaceType == (kSCNetworkInterfaceTypeBluetooth as String) { return "bluetooth" }
    if interfaceType == (kSCNetworkInterfaceTypeWWAN as String) { return "cellular" }
    if interfaceType == (kSCNetworkInterfaceTypeEthernet as String) {
        guard let usb = usb else { return "unknown" }
        return usb ? "usb" : "wired"
    }
    return "unknown"
}
func isUSBInterface(_ bsdName: String) -> Bool? {
    guard let matching = IOBSDNameMatching(kIOMainPortDefault, 0, bsdName) else { return nil }
    var entry = IOServiceGetMatchingService(kIOMainPortDefault, matching)
    guard entry != 0 else { return nil }
    for _ in 0..<24 {
        if IOObjectConformsTo(entry, "IOUSBHostDevice") != 0 || IOObjectConformsTo(entry, "IOUSBDevice") != 0 {
            IOObjectRelease(entry);return true
        }
        var parent: io_registry_entry_t = 0
        let result = IORegistryEntryGetParentEntry(entry, kIOServicePlane, &parent)
        IOObjectRelease(entry)
        if result != KERN_SUCCESS || parent == 0 { return false }
        entry = parent
    }
    IOObjectRelease(entry)
    return nil
}
func networkKinds() -> [String: String] {
    guard let interfaces = SCNetworkInterfaceCopyAll() as? [SCNetworkInterface] else { return [:] }
    var result: [String: String] = [:]
    for interface in interfaces {
        guard let name = SCNetworkInterfaceGetBSDName(interface) as String?,
              name.range(of: "^en[0-9]+$", options: .regularExpression) != nil else { continue }
        let type = SCNetworkInterfaceGetInterfaceType(interface) as String?
        let usb = type == kSCNetworkInterfaceTypeEthernet as String ? isUSBInterface(name) : nil
        result[name] = connectionKind(type, usb: usb)
    }
    return result
}

// Local interface counters only; no packet capture, traffic generation or addresses.
func networkCounters() -> [[String: Any]]? {
    let kinds = networkKinds()
    let store = SCDynamicStoreCreate(nil, "Cyberdeck network types" as CFString, nil, nil)
    var mib: [Int32] = [CTL_NET, PF_ROUTE, 0, 0, NET_RT_IFLIST2, 0]
    var length = 0
    guard sysctl(&mib, u_int(mib.count), nil, &length, nil, 0) == 0, length > 0 else { return nil }
    let buffer = UnsafeMutableRawPointer.allocate(byteCount: length, alignment: 8)
    defer { buffer.deallocate() }
    guard sysctl(&mib, u_int(mib.count), buffer, &length, nil, 0) == 0 else { return nil }
    var offset = 0
    var counters: [[String: Any]] = []
    while offset + 4 <= length {
        let pointer = buffer.advanced(by: offset)
        let size = Int(pointer.loadUnaligned(as: UInt16.self))
        guard size >= 4, offset + size <= length else { return nil }
        if pointer.load(fromByteOffset: 3, as: UInt8.self) == RTM_IFINFO2,
           size >= MemoryLayout<if_msghdr2>.size {
            let info = pointer.loadUnaligned(as: if_msghdr2.self)
            var name = [CChar](repeating: 0, count: Int(IFNAMSIZ))
            if if_indextoname(UInt32(info.ifm_index), &name) != nil {
                let label = String(cString: name)
                // enN covers this Mac's Wi-Fi/Ethernet. Exclude loopback, AWDL,
                // bridges and VPN tunnels to avoid counting traffic twice.
                if label.range(of: "^en[0-9]+$", options: .regularExpression) != nil,
                   info.ifm_flags & IFF_UP != 0, info.ifm_flags & IFF_RUNNING != 0 {
                    // A disabled/disconnected link contributes neither a type nor a rate.
                    if let store = store,
                       let link = SCDynamicStoreCopyValue(store, "State:/Network/Interface/\(label)/Link" as CFString) as? [String: Any],
                       let active = link[kSCPropNetLinkActive as String] as? Bool, !active { offset += size;continue }
                    counters.append(["kind": kinds[label] ?? "unknown", "id": label + ":" + String(info.ifm_index),
                        "rxBytes": info.ifm_data.ifi_ibytes, "txBytes": info.ifm_data.ifi_obytes])
                }
            }
        }
        offset += size
    }
    return counters.sorted { ($0["id"] as! String) < ($1["id"] as! String) }
}


func batterySnapshot() -> Any {
    guard let info = IOPSCopyPowerSourcesInfo()?.takeRetainedValue(),
          let sources = IOPSCopyPowerSourcesList(info)?.takeRetainedValue() as? [CFTypeRef] else { return NSNull() }
    for source in sources {
        guard let description = IOPSGetPowerSourceDescription(info, source)?.takeUnretainedValue() as? [String: Any],
              description[kIOPSTypeKey] as? String == kIOPSInternalBatteryType,
              let current = description[kIOPSCurrentCapacityKey] as? Int,
              let maximum = description[kIOPSMaxCapacityKey] as? Int, maximum > 0, current >= 0, current <= maximum else { continue }
        let charging = description[kIOPSIsChargingKey] as? Bool ?? false
        let external = description[kIOPSPowerSourceStateKey] as? String == kIOPSACPowerValue
        return ["percent": Double(current) / Double(maximum) * 100, "charging": charging, "external": external]
    }
    return NSNull()
}
func diskSnapshot() -> Any {
    guard let values = try? FileManager.default.attributesOfFileSystem(forPath: NSHomeDirectory()),
          let size = values[.systemSize] as? NSNumber, let free = values[.systemFreeSize] as? NSNumber,
          size.doubleValue > 0, free.doubleValue >= 0, free.doubleValue <= size.doubleValue else { return NSNull() }
    return ["total": size.uint64Value, "free": free.uint64Value]
}
func dockSnapshot() -> [String: Any] {
    let defaults = UserDefaults(suiteName: "com.apple.dock")
    let edge = defaults?.string(forKey: "orientation") ?? "bottom"
    let size = defaults?.double(forKey: "tilesize") ?? 48
    let magnified = defaults?.bool(forKey: "magnification") ?? false
    let large = defaults?.double(forKey: "largesize") ?? 96
    return ["edge": ["bottom","left","right"].contains(edge) ? edge : "bottom", "reserve": max(72, min(200, (magnified ? max(size,large) : size) + 28))]
}

#if NETWORK_KIND_TEST
assert(connectionKind(kSCNetworkInterfaceTypeIEEE80211 as String, usb: nil) == "wifi")
assert(connectionKind(kSCNetworkInterfaceTypeEthernet as String, usb: false) == "wired")
assert(connectionKind(kSCNetworkInterfaceTypeEthernet as String, usb: true) == "usb")
assert(connectionKind(kSCNetworkInterfaceTypeEthernet as String, usb: nil) == "unknown")
assert(connectionKind(kSCNetworkInterfaceTypeBluetooth as String, usb: nil) == "bluetooth")
assert(connectionKind(kSCNetworkInterfaceTypeWWAN as String, usb: nil) == "cellular")
assert(connectionKind(kSCNetworkInterfaceTypeIPSec as String, usb: false) == "unknown")
assert(connectionKind(nil, usb: true) == "unknown")
print("PASS: 8 interface classification checks")
#else
var cpu = host_cpu_load_info()
var cpuCount = mach_msg_type_number_t(MemoryLayout<host_cpu_load_info>.size / MemoryLayout<integer_t>.size)
let cpuResult = withUnsafeMutablePointer(to: &cpu) {
    $0.withMemoryRebound(to: integer_t.self, capacity: Int(cpuCount)) {
        host_statistics(mach_host_self(), HOST_CPU_LOAD_INFO, $0, &cpuCount)
    }
}
var vm = vm_statistics64()
var vmCount = mach_msg_type_number_t(MemoryLayout<vm_statistics64>.size / MemoryLayout<integer_t>.size)
let vmResult = withUnsafeMutablePointer(to: &vm) {
    $0.withMemoryRebound(to: integer_t.self, capacity: Int(vmCount)) {
        host_statistics64(mach_host_self(), HOST_VM_INFO64, $0, &vmCount)
    }
}
var pageSize: vm_size_t = 0
let pageResult = host_page_size(mach_host_self(), &pageSize)
guard cpuResult == KERN_SUCCESS, vmResult == KERN_SUCCESS, pageResult == KERN_SUCCESS else {
    fputs("Unable to read Mach statistics\n", stderr)
    exit(1)
}
let ticks = [cpu.cpu_ticks.0, cpu.cpu_ticks.1, cpu.cpu_ticks.2, cpu.cpu_ticks.3].map { UInt64($0) }
let memory = (UInt64(vm.active_count) + UInt64(vm.wire_count) + UInt64(vm.compressor_page_count)) * UInt64(pageSize)
let result: [String: Any] = ["ticks": ticks, "memoryBytes": memory,
    "totalBytes": ProcessInfo.processInfo.physicalMemory, "timestamp": Date().timeIntervalSince1970,
    "battery": batterySnapshot(), "disk": diskSnapshot(), "dock": dockSnapshot(),
    "uptime": ProcessInfo.processInfo.systemUptime, "network": networkCounters() as Any? ?? NSNull()]
let data = try JSONSerialization.data(withJSONObject: result, options: [.sortedKeys])
print(String(data: data, encoding: .utf8)!)

#endif
