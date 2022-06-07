import React, { useRef, useState, useEffect } from "react";
import ImageGallery from 'react-image-gallery';

import "react-image-gallery/styles/css/image-gallery.css";
import "./ImageSelection.css";

import { api_manager, Instance, Dataset } from "../../api";
import { ExplainerParameters } from "../ExplainerMenu";
import { Control, useWatch } from "react-hook-form";


export const ImageSelection = (props: {
  control: Control<ExplainerParameters>;
  initialDataset: ExplainerParameters["dataset"];
  hidden: boolean;
}) => {

  const dataset = useWatch<ExplainerParameters["dataset"]>({
    control: props.control,
    name: "dataset",
    defaultValue: props.initialDataset,
  });

  interface RefObject {
    getCurrentIndex: () => number
  };

  const startImageIndex = 0;
  const [imagesData, setImagesData] = useState<any>([{}]);
  const imageRef = useRef<RefObject>();

  //save image URL and index (instance number) in the following variables. 
  //The index (instance number) will have to be informed into the OptionsConfigurator
  const [currentImageURL, setCurrentImageURL] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(startImageIndex);

  useEffect(() => {
    if (dataset !== null && !props.hidden) {
      api_manager
        .getImagesData(dataset.id)
        .then((response) => {
          const images_data: any = response;
          setImagesData(prepareData(images_data.data));
        })
        .catch((error) => {
          alert(error);
        });
    }
  }, [dataset]);

  useEffect(() => {
    setCurrentImageURL(imagesData[startImageIndex].original);
  }, [imagesData]);

  const onImageChangeHandler = (event: any) => {
      //event.preventDefault();

      const imageIndex = imageRef.current?.getCurrentIndex();
      if(imageIndex !== undefined) {
        console.log(imageIndex)
        console.log(imagesData[imageIndex].original)
        setCurrentImageIndex(imageIndex);
        setCurrentImageURL(imagesData[imageIndex].original);
      }
  };

  //See details in https://github.com/xiaolin/react-image-gallery
  return <>
    {!props.hidden && 
      <ImageGallery
            items={imagesData} 
            startIndex={startImageIndex}
            showPlayButton={false}
            showFullscreenButton={false}
            ref={imageRef}
            showNav={true}
            showIndex={true}
            thumbnailPosition={"top"}
            slideInterval={0}
            slideDuration={0}
            swipingTransitionDuration={0}
            lazyLoad={true}
            onSlide={onImageChangeHandler}
      />
  }
  </>  
};

const prepareData = (imageData: any) => {
  return addCSSProperties(addExactFilesLocation(transformToGalleryFormat(imageData)))
}

const transformToGalleryFormat = (imageData: any) => {
  const new_format = [];
  for(var i = 0; i < imageData["images"].length; i++) {
    new_format.push({
      original: imageData["images"][i],
      thumbnail: imageData["thumbnails"][i]
    });
  };
  return new_format;
};

const addExactFilesLocation = (imageData: any) => {
  for(var i = 0; i < imageData.length; i++) {
    imageData[i] = {
      original: "/images/" + imageData[i].original,
      thumbnail: "/images/" + imageData[i].thumbnail
    }
  }
  return imageData
};

const addCSSProperties = (imageData: any) => {
  for (var i = 0; i < imageData.length; i++) {
    imageData[i] = {
      ...imageData[i],
      originalHeight: 500,
      thumbnailClass: "thumbnail",
    }
  }
  return imageData
};

//not used anymore, back request is working (at least in its beta version)
const getImagesURLs = () => {
  return  {
    "images": [
      "/images/freiburg_000000_000000_leftImg8bit.png",
      "/images/freiburg_000000_000001_leftImg8bit.png"
    ],
    "thumbnails": [
      "/images/freiburg_000000_000000_leftImg8bit.png",
      "/images/freiburg_000000_000001_leftImg8bit.png"
    ],
    "ground_truths": [
      "/images/freiburg_000000_000000_leftImg8bit.png",
      "/images/freiburg_000000_000001_leftImg8bit.png"
    ]
  }
};