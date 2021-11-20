import { Modal, Button } from "react-bootstrap";
import { deleteCategory } from "../api/category";
import { deleteItem } from "../api/item";
import { deleteReview } from "../api/review";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { refreshTokenAction } from "../redux/actions/userActions";
//import { useState } from "react";

const DeleteModal = (props) => {
  //const [name, setName] = useState('');
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const submit = async () => {
    const newToken = await dispatch(refreshTokenAction(user));
    const payload = {
      categoryId: props.categoryId,
      itemId: props.itemId,
      reviewId: props.reviewId,
      token: newToken == null ? user.token : newToken.token
    }

    var result = {};
    switch (props.type) {
      case 'CATEGORY':
        result = await deleteCategory(payload);
        break;
      case 'ITEM':
        result = await deleteItem(payload);
        break;
      case 'REVIEW':
        result = await deleteReview(payload);
        break;
      default:
        result.ok = false;
        break;
    }
    if (result.ok) {
      toast.success("Successfully deleted!");
      window.location.reload();
    }
    else toast.error("Could not delete.")
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Confirm removal</h5>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={submit}>Delete</Button>
        <Button variant="primary" onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;