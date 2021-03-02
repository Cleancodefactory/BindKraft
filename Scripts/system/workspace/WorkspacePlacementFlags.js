
/**
 * This flag set specifies in abstract manner placements by roles and status inside the role.
 * Flag fields
 * 
 * 0,1,2    - Area
 * 4-6,4,5    - position in area
 * 7,8      - active/inactive/indeterminate
 * 
 */
Enumeration("WorkspacePlacementFlags", {
    // Areas
    areaApps:           0x0000,
    areaDefault:        0x0000,
    areaOne:            0x0001,
    areaTwo:            0x0002,
    areaThree:          0x0003,
    areaFour:           0x0004,
    areaFive:           0x0005,
    areaSix:            0x0006,
    areaSeven:          0x0007,
    // system areas (persistent)
    placeSys1:          0x0001,
    placeSys2:          0x0002,
    placeSys3:          0x0003,

    // work areas (main work) can coincide with placeApps
    placeWork:0x0008,
    placeStatus: 0x0001,
    
});