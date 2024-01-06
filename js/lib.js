//
//  lib.js
//  portfolio
//
//  Created by Foxster on 2024-01-05.
//  Copyright (c) 2024 Foxster. All rights reserved.
//

export const $ = s => s.startsWith("#") && ![".", " ", ">"].some(c => s.includes(c))
    ? document.getElementById(s.substring(1))
    : document.querySelector(s);

export const $$ = s => document.querySelectorAll(s);
