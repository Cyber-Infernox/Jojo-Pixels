"use client";

import { useEffect, useState } from "react";
import Album from "@/components/shared/Album/Album";
import "./Gallery.css";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);

  return (
    <div id="Gallery" className="">
      {/* {photos.map((photo) => ( */}
      <Album photo={photos} />
      {/* ))} */}
    </div>
  );
};

export default Gallery;
