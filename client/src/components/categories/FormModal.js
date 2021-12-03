import { Modal, Button } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema } from "../../utilities/schemas";
import { useForm } from "react-hook-form";
import { addCategory, updateCategory } from "../../api/category";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useState } from "react";
import { refreshTokenAction } from "../../redux/actions/userActions";
import { useDispatch } from "react-redux";
import "../../utilities/FormModal.scss";
import { useNavigate } from "react-router-dom";

const FormModal = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState(props?.name ? props.name : '');
  const [imageUrl, setImageUrl] = useState(props?.imageURL ? props.imageURL : '');
  const user = useSelector(state => state.user);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(categorySchema)
  });

  const onSubmit = async (data) => {
    const newToken = await dispatch(refreshTokenAction(user));
    const payload = {
      id: props.id,
      name: data.name,
      imageUrl: data.imageUrl,
      token: newToken == null ? user.token : newToken.token
    }

    const result = props.edit ? await updateCategory(payload) : await addCategory(payload);
    if (result.ok) {
      toast.success(props.edit ? "Category updated!" : "Category added!");
      navigate('/');
      navigate('/categories');
    }
    else toast.error("Invalid data provided.");
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
          {props.edit === 0 ? "Add new category" : "Edit category"}
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <div className="base-form">
            <div className="content">
              <div className="form">
                <div className="form-group">
                  <label htmlFor="name">Name<span> *</span></label>
                  <input
                    className={errors?.name?.message ? "invalid-field" : ""}
                    type="text"
                    name="name"
                    placeholder="Name of the category"
                    defaultValue={name}
                    onChange={e => setName(e.target.value)}
                    {...register('name')}
                  />
                  <span>{errors?.name?.message}</span>
                </div>
                <div className="form-group">
                  <label htmlFor="imageUrl">Image URL</label>
                  <input
                    className={errors?.imageUrl?.message ? "invalid-field" : ""}
                    type="text"
                    name="imageUrl"
                    placeholder="Image URL"
                    defaultValue={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    {...register('imageUrl')}
                  />
                  <span>{errors?.imageUrl?.message}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn btn-success" onClick={props.changed}>Confirm</button>
          <Button variant="secondary" onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default FormModal;