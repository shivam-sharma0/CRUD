import React,{useState,useEffect} from "react";
import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Crud =()=>{


     const [show, setShow] = useState(false);

     const handleClose = () => setShow(false);
     const handleShow = () => setShow(true);

     const[name,setName]=useState('');
     const[age,setAge]=useState('');
     const[isActive,setIsActive]=useState(0);



     const[editId,setEditId]=useState('');
     const[editName,setEditName]=useState('');
     const[editAge,setEditAge]=useState('');
     const[editIsActive,setEditIsActive]=useState(0);


    const [data,setData]=useState([]) ; // store api responce for all the employee 



    //Get the Data from the Api which us made by .net and set to the main Data
    useEffect(()=>{
        getData();
    },[]);

       
    const getData = async()=>{
       let url = "https://localhost:7046/api/Employee";
    const responce = await fetch(url);
    const dataFromApi= await responce.json();
    setData(dataFromApi);
  }


// For Edit Function 
    const handleEdit=(id)=>{
        handleShow();
        axios
          .get(`https://localhost:7046/api/Employee/${id}`)
          .then((result) => {
           setEditName(result.data.name);
           setEditAge(result.data.age);
           setEditIsActive(result.data.isActive);
           setEditId(id);
          })
          .catch((error) => {  
            console.log(error);
          });
    }




    const handleUpdate=(id)=>{
        const url=`https://localhost:7046/api/Employee/${editId}`;
        const data={
             "id":editId,
            "name": editName,
            "age": editAge,
            "isActive": editIsActive
          }

          axios.put(url,data)
          .then((result)=>{
            handleClose();
            getData();
            clear();
            toast.success('Employee Has Been Updated');
          }).catch((error)=>{
              console.log(error)
          })
    }

    const handleSave=()=>{
      const url = "https://localhost:7046/api/Employee";
      const data={
            "name": name,
            "age": age,
            "isActive": isActive
          }
          axios.post(url,data)
          .then((result)=>{
            getData();
            clear();
            toast.success('Employee Has Been added');
          }).catch((error)=>{
              console.log(error)
          })
    }

    const clear=()=>{
     setAge('');
     setName('');
     setIsActive(0);

     setEditAge('');
     setEditName("");
     setEditIsActive(0);
     setEditId('');

    }

    const handleActiveChange=(e)=>{
      if(e.target.checked){
        setIsActive(1);
      }else{
        setIsActive(0);
      }
    }

    const handleEditActiveChange=(e)=>{
      if(e.target.checked){
        setEditIsActive(1);
      }else{
        setEditIsActive(0);
      }
    }



    const handleDelete=(id)=>{
        if(window.confirm("Are you want to remove this person")===true){
            axios
              .delete(`https://localhost:7046/api/Employee/${id}`)
              .then((result) => {
                if (result.status === 200) {
                  getData();
                  toast.success("Employee has been deleted");
                }
              })
              .catch((error) => {
                toast.success(error);
              });
        }
    }

    return (
      <div className="review">
        <h1 style={{marginLeft:"-30px"}}>CRUD</h1>
        <ToastContainer />
        <Container className="reviewComponent" style={{ marginLeft: "320px" }}>
          <Row>
            <Col>
              <input
                type="text"
                className="Input"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="Input"
                placeholder="Enter Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="checkbox"
                checked={isActive === 1 ? true : false}
                onChange={(e) => handleActiveChange(e)}
                value={isActive}
              />
              <label>IsActive</label>
            </Col>
            <Col>
              <button className="btn" onClick={() => handleSave()}>
                Submit
              </button>
            </Col>
          </Row>
          <div className="underline"></div>
        </Container>
        <br />
        <Table striped bordered hover className="reviewComponent">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Name</th>
              <th>Age</th>
              <th>IsActive</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0
              ? data.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.age}</td>
                      <td>{item.isActive}</td>
                      <td colSpan={2}>
                        <button
                          className="btn"
                          onClick={() => handleEdit(item.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              : "Loading..."}
          </tbody>
        </Table>
        <Modal
          show={show}
          onHide={handleClose}
          style={{ marginLeft: "0px" }}
          className="reviewComponent"
        >
          <Modal.Header closeButton>
            <Modal.Title>Modify / Update Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <input
                  type="text"
                  className="Input"
                  placeholder="Enter Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </Col>
              <Col>
                <input
                  type="text"
                  className="Input"
                  placeholder="Enter Age"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                />
              </Col>
              <Col>
                <input
                  type="checkbox"
                  checked={editIsActive === 1 ? true : false}
                  onChange={(e) => handleEditActiveChange(e)}
                  value={editIsActive}
                />
                <label>IsActive</label>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="btn" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" className="btn" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
}

export default Crud;
