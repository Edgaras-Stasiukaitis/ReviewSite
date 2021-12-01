import { Modal, Button } from "react-bootstrap";
import { deleteCategory } from "../api/category";
import { deleteItem } from "../api/item";
import { deleteReview } from "../api/review";
import { deleteUser } from "../api/user";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { refreshTokenAction } from "../redux/actions/userActions";
import { useNavigate, useLocation } from "react-router-dom";

const DeleteModal = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const submit = async () => {
    const newToken = await dispatch(refreshTokenAction(user));
    const payload = {
      categoryId: props.categoryId,
      itemId: props.itemId,
      reviewId: props.reviewId,
      userId: props.userId,
      token: newToken == null ? user.token : newToken.token
    }

    var result = {};
    switch (props.type) {
      case 'categories':
        result = await deleteCategory(payload);
        break;
      case 'items':
        result = await deleteItem(payload);
        break;
      case 'user/reviews':
      case 'reviews':
        result = await deleteReview(payload);
        break;
      case 'users':
        result = await deleteUser(payload);
        break;
      default:
        result.ok = false;
        break;
    }
    if (result.ok) {
      toast.success("Successfully deleted!");
      navigate('/');
      navigate(`/${props.type}`, { state: location.state })
    }
    else toast.error("Could not delete.")
  }

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Are you sure you want to delete this item?</h5>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={submit}>Delete</Button>
        <Button variant="secondary" onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;