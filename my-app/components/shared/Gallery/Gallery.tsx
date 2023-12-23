"use client";

import { useEffect, useState } from "react";
import Album from "@/components/shared/Album/Album";
import "./Gallery.css";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/photos"
      );
      const json = await response.json();

      if (response.ok) {
        console.log(json[0]);
        setPhotos(json[0]);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <div id="Gallery" className="">
      {/* {photos.map((photo) => ( */}
      <Album photo={photos} />
      {/* ))} */}
    </div>
  );
};

export default Gallery;
