-- SPDX-License-Identifier: GPL-3.0-or-later
-- Keep language navigation inside the offline HTML manuals.
function Link(link)
  local names = {['INSTALL.md']='INSTALL.html', ['INSTALL.ja.md']='INSTALL.ja.html'}
  if names[link.target] then link.target = names[link.target] end
  return link
end
