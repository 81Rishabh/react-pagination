import React from 'react'

function Pagination({ memberPerPage, totalMembers, changePage, handleNext, handlePrev }) {
    const pageNumbers = [];

    // render pagination numbers
    for (let i = 1; i <= Math.ceil(totalMembers / memberPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <ul className="pagination">
            <li id="arrow-back" onClick={e => handlePrev(e)}>
                <svg width="15" height="15" fill="grey" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.51 3.87 15.73 2.1 5.84 12l9.9 9.9 1.77-1.77L9.38 12l8.13-8.13Z"></path>
                </svg>
            </li>
            {
                pageNumbers.map((number, idx) => {
                    return number === 1 ? (
                        <li key={idx} onClick={(e) => changePage(e, number)} className="page_number_btn active"id={number}>
                         {number}
                        </li>
                    ) : (
                        <li key={idx} onClick={(e) => changePage(e, number)} className="page_number_btn" id={number}>
                        {number}
                       </li>
                    );
                })
            }
            <li id="arrow-forward" onClick={(e) => handleNext(e, pageNumbers.length)}>
                <svg width="15" height="15" fill="grey" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.115 20.23 7.885 22l10-10-10-10-1.77 1.77 8.23 8.23-8.23 8.23Z"></path>
                </svg>
            </li>
        </ul>
    )
}

export default Pagination