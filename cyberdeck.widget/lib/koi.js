// SPDX-FileCopyrightText: 2026 panna-elec
// SPDX-License-Identifier: GPL-3.0-or-later
// This grant includes the embedded koi SVG; see LICENSE_SCOPE.md.
// Original vector interpretation of the user-provided curved koi illustration.
// No filled silhouette: only faint guides and a few traveling contour highlights.
const contours = [
  // Long upper tail, lower tail lobes, and curved body.
  ['M292 433 C390 342 418 207 536 119 C637 54 768 39 865 99 C951 156 992 243 1084 238 C1001 259 928 212 861 182 C791 148 744 178 694 212', 'cyan'],
  ['M344 399 C464 342 504 256 648 220 C792 173 889 274 1029 304 C1096 320 1135 278 1128 214 C1150 327 1061 395 981 405 C874 426 795 368 716 340 C580 287 467 319 344 399', 'pink'],
  ['M346 402 C480 326 566 322 669 362 C760 398 787 497 932 461 C845 519 749 479 680 437 C548 357 454 358 346 402', 'cyan'],
  ['M343 401 C279 441 229 496 212 570 C185 678 229 772 331 837 C419 895 503 902 603 945 C663 972 713 989 748 970', 'pink'],
  ['M453 378 C361 380 311 431 316 490 C321 571 376 656 442 709 C510 763 576 793 639 828 C702 863 743 903 755 947 C762 963 751 976 731 979', 'cyan'],
  // Pectoral and ventral fins: preserve the sweeping pointed shapes.
  ['M568 795 C494 755 401 719 399 591 C418 656 470 671 514 712 C549 746 550 774 568 795', 'cyan'],
  ['M520 904 C449 892 382 912 302 911 L277 907 C328 955 386 995 454 989 C501 984 521 954 544 928', 'pink'],
  ['M275 807 C209 806 145 758 148 657 C164 718 187 727 218 737', 'cyan'],
  ['M252 474 C207 417 216 341 327 280 C273 330 276 364 264 414 C258 437 260 451 252 474', 'cyan'],
  // Whiskers and the original open circular sweep.
  ['M750 956 C780 913 853 890 836 833 C832 816 818 800 798 788', 'pink'],
  ['M725 977 C690 1018 603 1018 554 1042 C532 1053 521 1072 519 1091', 'cyan'],
  ['M380 135 C166 248 54 439 58 635 C65 933 295 1145 618 1154 C792 1158 942 1110 1058 991', 'cyan']
];
const rays = [
 'M304 424 C436 305 463 178 613 109 C681 77 745 63 800 68',
 'M325 414 C458 305 484 159 690 119 C773 101 829 113 889 146',
 'M341 403 C487 289 527 177 722 171 C789 169 829 174 861 182',
 'M348 397 C486 313 569 240 723 231 C849 220 952 352 1072 333',
 'M352 398 C511 303 595 277 717 287 C865 296 930 386 1059 371',
 'M357 395 C493 333 601 302 705 320 C806 337 885 410 981 405',
 'M369 398 C512 357 607 356 700 406 C771 445 827 477 896 473',
 'M239 606 C228 722 318 802 424 847 C554 899 647 952 731 970',
 'M401 602 C421 709 505 745 556 780',
 'M409 636 C452 733 517 755 566 793',
 'M289 918 C371 948 448 949 520 918',
 'M305 936 C386 973 456 973 526 925',
 'M171 716 C188 765 224 791 266 799',
 'M242 450 C237 392 254 335 303 302',
 'M614 936 C641 936 651 953 672 954'
];
export function createKoi(make) {
 const group=make('g',{class:'koi-art','data-koi-contours':contours.length,'aria-hidden':'true'});
 contours.forEach(([d,tone],i)=>{
  const pathGroup=make('g',{class:'koi-contour koi-'+tone});
  pathGroup.style.setProperty('--koi-duration',(18+(i%5)*3)+'s');
  pathGroup.style.setProperty('--koi-delay',(-((i*4.9+7)%27))+'s');
  pathGroup.style.setProperty('--koi-steps',String((18+(i%5)*3)*30));
  pathGroup.append(make('path',{d,pathLength:1000,class:'koi-guide'}));
  for(const part of ['wake','trail','head'])pathGroup.append(make('path',{d,pathLength:1000,class:'koi-flow koi-'+part}));
  group.append(pathGroup);
 });
 for(const d of rays)group.append(make('path',{d,class:'koi-ray'}));
 group.append(make('path',{d:'M606 936 Q632 937 649 951 Q624 949 606 936',class:'koi-eye'}));
 return group;
}
export function koiScale(width,height,wallpaperScale,size=100){const factor=[100,115,130].includes(Number(size))?Number(size)/100:1;return Math.min(width*.45,height*.68)*factor/(1254*wallpaperScale);}
