var PopUpsPositionEnum = Enumeration("PopUpsPositionEnum", {
    center:         0, // Default must not be combined with directions
    docked:         0x01,
    fill:           0x02, 
    auto:           0x04, // attach auto behavior for responsiveness - implementation decides if directional flags will have effect and what effect.
    left:           0x08, // 0b00001000
    top:            0x10, // 0b00010000
    right:          0x20, // 0b00100000   
    bottom:         0x40, // 0b01000000
    // Combinations - typical
    topleft:        0x18,
    topright:       0x30,
    bottomleft:     0x48,
    bottomright:    0x60
    
});