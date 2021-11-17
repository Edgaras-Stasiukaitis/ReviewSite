import { Modal, Button } from "react-bootstrap";
import { deleteCategory } from "../../api/category";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const DeleteModal = (props) => {
  const user = useSelector(state => state.user);

  const submit = async () => {
    const payload = {
      id: props.id,
      token: user.token
    }
    const result = await deleteCategory(payload);
    if(result.ok){
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
        <h5>Confirm category removal</h5>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={submit}>Delete</Button>
        <Button variant="primary" onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;