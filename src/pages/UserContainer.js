import React, { useState, useEffect } from 'react'
import Pagination from '../Components/Pagination';

function UserContainer(props) {
    const { loading, members, memberPerPage, totalMembers, changePage, handleNext, handlePrev } = props;
    const [Members, setMembers] = useState(members);
    const [Ids, setIds] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [currentEditId, setCurrentEditId] = useState("");

    // set members at intial
    useEffect(() => {
        setMembers([...members]);
    }, [members]);

    // HandleDeleteMember
    const HandleDeleteMember = function (id) {
        const restMember = Members.filter(member => member.id !== id);
        setMembers([...restMember]);
    }

    // handleEdit
    const handleEdit = function () {
        const updatedMember = {
            id: currentEditId,
            name,
            email,
            role
        };

        let startIdx = members.findIndex(member => member.id === currentEditId);
        members.splice(startIdx, 1, updatedMember);
        setMembers([...members]);
        handleShowAndHideEditInputs(currentEditId);
    }

    // handleSelectMember
    const handleSelectMember = function (e, id) {
        setIds(prev => {
            if (e.target.checked && prev.length === 0) {
                prev = id;
            } else if (e.target.checked && prev.length > 0) {
                prev = [...prev, id];
            }
            else if (!e.target.checked) {
                prev = [...prev.filter(prevId => prevId !== id)];
            }
            return prev;
        });
    }

    // handleEditMember
    const handleEditMember = function (member) {
        const { id, name, email, role } = member;
        setCurrentEditId(id);
        setName(name);
        setEmail(email);
        setRole(role);
        handleShowAndHideEditInputs(id);
    }
    
    // handle show and hide Edit inputs
    const handleShowAndHideEditInputs = function (id) {
        const editInputs = document.querySelectorAll(".Edit-input-container");
        Array.from(editInputs)
            .filter(curr => curr.getAttribute('id') === `edit-${id}`)
            .forEach(curr => {
                if (curr.classList.contains("show")) {
                    curr.classList.remove('show');
                    curr.classList.add('hide');
                } else if (curr.classList.contains("hide")) {
                    curr.classList.remove('hide');
                    curr.classList.add('show');
                }
            });
    }

    // HandleDeleteMembers
    const HandleDeleteMembers = function () {
        if (Ids.length === members.length) {
            setMembers([]);
            return;
        }
        let restOfMembers = deleteMember(Ids, 0);
        setMembers([...restOfMembers]);
    }

    // delete member recursive
    function deleteMember(ids, index) {
        if (index >= ids.length) return members;

        let restOfMemers = deleteMember(ids, index + 1);
        return restOfMemers.filter(member => member.id !== ids[index]);
    }

    // handleSelectAll
    function handleSelectAll(e) {
        // get all the ids
        const membersIds = members.map(member => member.id);

        // get all checkboxes
        const checkboxes = document.querySelectorAll('.checkbox');

        // check if checkbox is checked
        if (e.target.checked) {
            Array.from(checkboxes).forEach(checkbox => checkbox.setAttribute('checked', true));
        }
        else {
            Array.from(checkboxes).forEach(checkbox => checkbox.removeAttribute('checked'));
        }
        setIds([...membersIds]);
    }

    // handleSearchText
    function handleSearchText(e) {
        setSearchText(e.target.value);
        const matches = members.filter(member => {
            let regex = new RegExp(`${e.target.value}`, 'g');
            return member.name.match(regex) || member.email.match(regex) || member.role.match(regex);
        });
        setMembers([...matches]);
    }


    return (
        <section className="main-container">
            <header>
                <input type="text" className="search-bar" value={searchText} placeholder="search by name,email,role" onChange={handleSearchText} />
            </header>
            <div className="table-container">
                {
                    loading ? <div className="loading-container">
                        <h3>Loading.....</h3>
                    </div> : (
                        <table cellPadding="10">
                            <thead>
                                <tr>
                                    <th><input type="checkbox" className="checkbox" onChange={handleSelectAll} /></th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Members && Members.map(member => {
                                        return (
                                            <tr key={member.id}>
                                                <td><input type="checkbox" className="checkbox" onChange={(e) => handleSelectMember(e, member.id)} /></td>
                                                <td>{member.name}</td>
                                                <td>{member.email}</td>
                                                <td>{member.role}</td>
                                                <td className="action-btns">
                                                    <span onClick={() => handleEditMember(member)}>
                                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                        </svg>
                                                    </span>
                                                    <span onClick={() => HandleDeleteMember(member.id)}>
                                                        <svg width="15" height="15" fill="none" stroke="red" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M3 6h18"></path>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        </svg>
                                                    </span>

                                                </td>
                                                <td className="Edit-input-container hide" id={`edit-${member.id}`}>
                                                    <input type="text" className="name-input" value={name} onChange={e => setName(e.target.value)} />
                                                    <input type="email" className="email-input" value={email} onChange={e => setEmail(e.target.value)} />
                                                    <input type="role" className="name-input" value={role} onChange={e => setRole(e.target.value)} />
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    )
                }
                <div className="table-footer">
                    <button className="edit-btn" onClick={handleEdit}>Update</button>
                    <button className="delete-btn" onClick={HandleDeleteMembers} disabled={Ids.length === 0 ? true : false}>Delete</button>
                </div>
            </div>

            <Pagination
                memberPerPage={memberPerPage}
                totalMembers={totalMembers}
                changePage={changePage}
                handleNext={handleNext}
                handlePrev={handlePrev}
            />
        </section>
    )
}

export default UserContainer;