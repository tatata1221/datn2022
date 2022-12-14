import { Button, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import Axios from "axios";
import Toast_Comp from "../../../../../components/Toast/Toast_Comp";
import Spinner_comp from "../../../../../components/Spinner/Spinner_comp";
import "./AddCourseModal.css";
import { useDispatch } from "react-redux";
import { fetchCourseInfo } from "../../../../../Redux/course/courseAction";

const AddCourseModal = () => {
  const [show, setShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);
  const [courseThumbnail, setCourseThumbnail] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseName, setCourseName] = useState("");
  const [codeRoom, setCodeRooms] = useState("");
  const [detailData, setDetailData] = useState("");
  const [imgLabel, setImgLabel] = useState("Choose photo");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    setImgLabel(courseThumbnail.name);
  }, [courseThumbnail]);

  const courseFormHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("courseName", courseName);
    formData.append("courseDescription", courseDescription);
    formData.append("img", courseThumbnail);
    formData.append("courseRoom", codeRoom);
    formData.append("courseDetail", detailData);

    fetch("/post-course", {
      body: formData,
      method: "post",
      headers: {
        authorization: "Bearer " + localStorage.getItem("auth_token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setToast(true);
        setLoading(false);
        setCourseDescription("");
        setCourseName("");
        setCodeRooms("");
        setCourseThumbnail("");
        setDetailData("");
        dispatch(fetchCourseInfo());
        dispatch({ type: "UPDATE__COURSE__LIST", payload: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeCode = (e) => {
    let str = e.target.value;

    setCodeRooms(slug(str));
  };

  const slug = function (str) {
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ?? for n, etc
    var from = "?????????????????????????????????????????????????????/_,:;";
    var to = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  };

  return (
    <div>
      <Button color="primary" variant="contained" onClick={handleShow}>
        Th??m Kh??a H???c
      </Button>

      <Toast_Comp
        setToast={setToast}
        renderToast={toast}
        msg="Th??m m???i kho?? h???c th??nh c??ng"
        type={'success'}
      />

      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Typography color="textSecondary" variant="h4">
              Th??m Kh??a H???c
            </Typography>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && <Spinner_comp />}

          <Form onSubmit={courseFormHandler} encType="multipart/form-data">
            <Form.Group>
              <Form.Label>T??n L???p H???c</Form.Label>
              <Form.Control
                required
                onChange={(e) => setCourseName(e.target.value)}
                value={courseName}
                type="text"
                placeholder="Nh???p t??n l???p h???c"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>M?? t??? L???p Hoc</Form.Label>

              <Form.Control
                required
                onChange={(e) => setCourseDescription(e.target.value)}
                value={courseDescription}
                as="textarea"
                rows={3}
                placeholder="Nh???p m?? t??? l???p h???c"
              />
            </Form.Group>
            <Form.Group className="input__file">
              <label>???nh m?? t???</label>
              <br />
              <Form.File
                required
                type="file"
                filename="img"
                onChange={(e) => setCourseThumbnail(e.target.files[0])}
                id="custom-file"
                custom
                label={imgLabel ? `${imgLabel}` : "Choose photo"}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                M?? ph??ng*{" "}
                <p style={{ color: "red", display: "inline" }}>
                  Kh??ng ???????c ch???a c??c k?? t??? ?????c bi???t
                </p>
              </Form.Label>

              <Form.Control
                required
                onChange={(e) => handleChangeCode(e)}
                value={codeRoom}
                type="text"
                placeholder="Nh???p m?? code"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Chi ti???t </Form.Label>

              <Form.Control
                required
                onChange={(e) => setDetailData(e.target.value)}
                value={detailData}
                as="textarea"
                rows={3}
                placeholder="Nh???p chi ti???t"
              />
            </Form.Group>
            <Button type="submit" color="primary" variant="contained">
              X??c nh???n
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="secondary" variant="contained" onClick={handleClose}>
            ????ng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddCourseModal;
