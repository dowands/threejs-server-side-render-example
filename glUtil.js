import {PNG} from "pngjs"
import glClass from "gl"

export function createGl (width, height){
  let glInstance = glClass(width, height, { preserveDrawingBuffer: true });
  if(glInstance === null){
    throw new Error('gl context is null');
  }
  glInstance.canvas = {
      width: width, 
      height: height
  }
  return glInstance
}

export function saveImage (renderer, outputSteam){
  return new Promise((resolve, rejects) => {
    var width = renderer.getContext().canvas.width;
    var height = renderer.getContext().canvas.height;
    var bitmapData = new Uint8Array(width * height * 4)
    renderer.getContext().readPixels(0, 0, width, height, renderer.getContext().RGBA, renderer.getContext().UNSIGNED_BYTE, bitmapData)
    
    // Create a PNG from the array
    const png = new PNG({
      width: width,
      height: height,
      filterType: -1
    });
    
    // Copy byte array to png object  
    for(var i=0;i<bitmapData.length;i++) {
      png.data[i] = bitmapData[i];
    }
    
    const pack = png.pack();
    pack.on("end", () => resolve())
    pack.pipe(outputSteam);
  });
}