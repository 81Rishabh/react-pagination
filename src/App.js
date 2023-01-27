import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import './App.css';
import UserContainer from './pages/UserContainer';


function App() {
  const [loading, setloading] = useState(false);
  const [members, setmembers] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const MemberPerPage = 10;
  
  useEffect(() => {
    const fetchMembers = async () => {
      console.log("render");
      setloading(true);
      let members = await Axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
      setmembers(members.data);
      setloading(false);
    }
    fetchMembers();
  }, []);

  // getting indexs
  const indexOfLastMember = currentPage * MemberPerPage;
  const indexOfFirstMember = indexOfLastMember - MemberPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);
  const totalMembers = members.length;

  // handle prev button appearance
  useEffect(() => {
    const arrowBack = document.getElementById('arrow-back');
    const arrowForward = document.getElementById('arrow-forward');

    // arrow back
    arrowTrasformStyle(arrowBack , 1);

    // arrow next
    arrowTrasformStyle(arrowForward , Math.ceil(totalMembers / MemberPerPage));

     function arrowTrasformStyle(element , pageNumber) {
      if (element && currentPage === pageNumber) {
        element.style.transform = 'scale(0)';
      } else {
        element.style.transform = 'scale(1)';
      }
    }
  }, [currentPage,totalMembers , MemberPerPage]);
  

  // arrow transform style
  


  // handle pagination event
  const changePage = (e, pageNumber) => {
    const pageButtons = document.querySelectorAll(".page_number_btn");
    const currentBtn = e.target;

      // adding classList
      if (currentBtn.classList.contains("active")) {
        currentBtn.classList.remove('active');
      } else {
        currentBtn.classList.add('active');
      }

       Array.from(pageButtons)
       .filter(btn => btn !== currentBtn)
       .forEach(btn => {
            if (btn.classList.contains("active")) {
              btn.classList.remove('active');
              btn.classList.add('not-active');
            } else {
              btn.classList.add('not-active');
            }
       });

    //  set current page
    setcurrentPage(pageNumber);
  }

  // Handle new button action
  const handleNext = function (e, lastPageNumber) {
    e.stopPropagation();
    setcurrentPage(prev => {
      document.getElementById(`${prev}`).classList.remove('active');
      prev = prev + 1;
      document.getElementById(`${prev}`).classList.add('active');
     
      handleTransform(e, prev, lastPageNumber);
      return prev;
    });
  }

  // handle prev button action
  const handlePrev = function (e) {
    e.stopPropagation();
    setcurrentPage(prev => {
      document.getElementById(`${prev}`).classList.remove('active');
      prev = prev - 1;
      document.getElementById(`${prev}`).classList.add('active');
      handleTransform(e, prev, 1);
      return prev;
    });
  }

  const handleTransform = (e, prevState, pageNumber) => {
    let element = e.target.tagName !== 'svg' ? e.target : e.target.parentElement;
    if (prevState === pageNumber) {
        element.style.transform = 'scale(0)';
    }else {
        element.style.transform = 'scale(1)';
    }
  }

  return (
    <div className="App">
      <UserContainer
        loading={loading}
        members={currentMembers}
        memberPerPage={MemberPerPage}
        totalMembers={members.length}
        changePage={changePage}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />
    </div>
  );
}

export default App;
