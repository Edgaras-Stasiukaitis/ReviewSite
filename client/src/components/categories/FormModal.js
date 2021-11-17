import { Modal, Button } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema } from "../../utilities/schemas";
import { useForm } from "react-hook-form";
import { addCategory, updateCategory } from "../../api/category";
import { toast } from "react-toastify";
import '../auth/style.scss';
import { useSelector } from "react-redux";

const FormModal = (props) => {
  const user = useSelector(state => state.user);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(categorySchema)
  });

  const onSubmit = async (data) => {
    const payload = {
      id: props.id,
      name: data.name,
      imageUrl: data.imageUrl,
      token: user.token
    }
    if (props.edit) {
      const result = await updateCategory(payload);
      if (result.ok) {
        toast.success("Successfully updated!");
        window.location.reload();
      }
      else toast.error("Invalid data provided.");
    } else {
      const result = await addCategory(payload);
      if (result.ok) {
        toast.success("Successfully added!");
        window.location.reload();
      }
      else toast.error("Invalid data provided.");
    }
  }
  console.log("ter");

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit category
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <div className="base-container">
            <div className="content">
              <div className="form">
                <div className="form-group">
                  <label htmlFor="name">Name<span> *</span></label>
                  <input type="text" name="name" placeholder="name" value={props?.name != null ? props.name : ""} {...register('name')} />
                  <span>{errors?.name?.message}</span>
                </div>
                <div className="form-group">
                  <label htmlFor="imageUrl">Image url<span> *</span></label>
                  <input type="imageUrl" name="imageUrl" placeholder="imageUrl" value={props?.imageUrl != null ? props.imageUrl : ""} {...register('imageUrl')} />
                  <span>{errors?.imageUrl?.message}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn btn-success" onClick={props.changed} >Confirm</button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default FormModal;