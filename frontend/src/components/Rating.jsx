import React, { useState } from 'react';
import '../componentStyles/Rating.css';

function Rating({value, onRatingChange, disabled}) {
  const [hoveredRating, setHoveredRating]= useState(0);
  const [selectedRating, setSelectedRating]= useState(value||0);

  //Handle star hover
  const handleMouseEnter=(rating)=>{
    if(!disabled){
      setHoveredRating(rating);
    }
  }

  //Mouse Leave
  const handleMouseLeave=()=>{
    if(!disabled){
      setHoveredRating(0);
    }
  }

  //Handle star click
  const handleClick=(rating)=>{
    if(!disabled){
      setSelectedRating(rating);
    }
  }
  return (
    <div>
      <div className="rating">⭐</div>
    </div>
  )
}

export default Rating
