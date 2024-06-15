import React from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { app } from "../../firebaseinit";
import { getStorage, uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const ModalPhoto = ({ setLoading, form, setForm }) => {
  const [show, setShow] = useState(false);
  const [fileName, setFileName] = useState(form.photo);
  const [file, setFile] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const storage = getStorage(app);
  const db = getFirestore(app);
  const uid = sessionStorage.getItem("uid");
  const style = {
    cursor: "pointer",
    borderRadius: "50%",
    width: "80px",
  };
  const style1 = {
    borderRadius: "50%",
    width: "200px",
    marginbottom: "5px",
  };
  const onChangeFile = (e) => {
    setFileName(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };
  const onClickSave = async () => {
    if (!file) {
      alert("변경할 이미지를 선택해주세요!");
      return;
    }
    if (!window.confirm("사진을 변경하시겠습니까?")) return;
    //사진저장(업로드)
    setLoading(true);
    const res = await uploadBytes(
      ref(storage, `photo/${Date.now()}.jpg`),
      file
    );
    const url = await getDownloadURL(res.ref);
    await setDoc(doc(db, `users/${uid}`), { ...form, photo: url });
    setForm({ ...form, photo: url });
    setLoading(false);
  };
  return (
    <>
      <img
        src={form.photo || "http://via.placeholder.com/80x80"}
        style={style}
        alt=""
        onClick={handleShow}
      />

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        style={{ top: "30%" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>사진 변경</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={fileName || "http://via.placeholder.com/200x200"}
            style={style1}
            alt=""
          />
          <Form.Control type="file" onChange={onChangeFile}></Form.Control>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onClickSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalPhoto;
