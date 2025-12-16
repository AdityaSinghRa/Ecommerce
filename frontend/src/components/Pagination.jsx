import React from "react";
import "../componentStyles/Pagination.css";
import { useDispatch, useSelector } from "react-redux";

function Pagination({
  currentPage,
  onPageChange,
  activeClass = "active",
  nextPageText = "Next",
  prevPageText = "Prev",
  firstPageText = "1st",
  lastPageText = "Last",
}) {
  const { totalpages, products } = useSelector((state) => state.product);
  if (products.length === 0 || totalpages <= 1) return null;

  //Generate Page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const pageWindow = 2;
    for (
      let i = Math.max(1, currentPage - pageWindow);
      i <= Math.min(totalpages, currentPage + pageWindow);
      i++
    ) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="pagination">
      {/*First and Prev Button*/}
      {
        currentPage>1 &&(
          <>
          <button className="pagination-btn" onClick={()=>onPageChange(1)}>{firstPageText}</button>

           <button className="pagination-btn" onClick={()=>onPageChange(currentPage-1)}>{prevPageText}</button>
          </>
        )
      }

{ /*Dispaly Numbers b/w them*/ }

{
  getPageNumbers().map((number)=>(
    <button className={`pagination-btn ${currentPage===number?activeClass:''}`} key={number} onClick={()=>onPageChange(number)}>{number}</button>
  ))
}


      {/*Last and Next Button*/}
      {
        currentPage<totalpages &&(
          <>
          <button className="pagination-btn" onClick={()=>onPageChange(currentPage+1)}>{nextPageText}</button>

           <button className="pagination-btn" onClick={()=>onPageChange(totalpages)}>{lastPageText}</button>
          </>
        )
      }
    </div>
  )
}

export default Pagination;
