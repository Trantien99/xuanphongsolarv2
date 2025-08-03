# Mobile Scroll Fix

## Problem
On mobile devices, when users tried to scroll up/down on image galleries and category menus, the scrolling was blocked due to aggressive touch event handling.

## Root Cause
Two components were preventing all touch events, including vertical scrolling:

1. **ImageGallery** (`client/src/components/product/image-gallery.tsx`)
2. **MobileCategoryMenu** (`client/src/components/layout/header.tsx`)

### Issues Found:
- `touchAction: 'none'` - Completely disabled all touch interactions
- `e.preventDefault()` called on all touch events - Blocked default scroll behavior
- No distinction between horizontal swipes (intended) and vertical swipes (should allow scrolling)

## Solution
Implemented selective touch handling that:

1. **Detects swipe direction** - Distinguishes between horizontal and vertical swipes
2. **Only prevents horizontal swipes** - Allows vertical scrolling to work normally  
3. **Updated touch-action** - Changed from `'none'` to `'pan-y'` (allows vertical panning)

### Key Changes:

#### Touch Direction Detection:
```typescript
// Added Y-axis tracking
const touchStartY = useRef<number | null>(null);
const touchEndY = useRef<number | null>(null);
const isHorizontalSwipe = useRef<boolean | null>(null);

// Detect swipe direction
const deltaX = Math.abs(touchEndX.current - touchStartX.current);
const deltaY = Math.abs(touchEndY.current - touchStartY.current);

if (isHorizontalSwipe.current === null && (deltaX > 10 || deltaY > 10)) {
  isHorizontalSwipe.current = deltaX > deltaY;
}
```

#### Selective Event Prevention:
```typescript
// Only prevent default for horizontal swipes
if (isHorizontalSwipe.current && images.length > 1) {
  e.preventDefault();
  e.stopPropagation();
}
```

#### Updated CSS Touch Action:
```typescript
style={{ touchAction: 'pan-y' }} // Allow vertical panning (scrolling)
```

## Result
✅ Users can now scroll vertically on mobile while still being able to swipe horizontally for image/category navigation

✅ Maintains all existing swipe functionality for navigation

✅ No interference with page scrolling or other touch interactions