var MemFileFlags = {
	none: 0,
	"volatile": 0x0001,
	persistent:	0x0002,
	unresolved: 0x0004	// Files that need some additional work/operation for their content to become available are created with this flag. The flag is cleared when the content is resolved/loaded
};