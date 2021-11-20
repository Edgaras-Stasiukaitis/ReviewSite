import { Modal, Button } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema } from "../../utilities/schemas";
import { useForm } from "react-hook-form";
import { addItem, updateItem } from "../../api/item";
import { toast } from "react-toastify";
import '../auth/style.scss';
import { useSelector } from "react-redux";
import { useState } from "react";
import { refreshTokenAction } from "../../redux/actions/userActions";
import { useDispatch } from "react-redux";

const FormModal = (props) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(props?.item?.name != null ? props.item.name : '');
  const [description, setDescription] = useState(props?.item?.description != null ? props.item.description : '');
  const [imageUrl, setImageUrl] = useState(props?.item?.imageURL != null ? props.item.imageURL : '');
  const user = useSelector(state => state.user);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(categorySchema)
  });

  const onSubmit = async (data) => {
    const newToken = await dispatch(refreshTokenAction(user));
    const payload = {
      categoryId: props?.category?.id,
      itemId: props?.item?.id,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      token: newToken == null ? user.token : newToken.token
    }

    if (props.edit) {
      const result = await updateItem(payload);
      if (result.ok) {
        toast.success("Successfully updated!");
        window.location.reload();
      }
      else toast.error("Invalid data provided.");
    } else {
      const result = await addItem(payload);
      if (result.ok) {
        toast.success("Successfully added!");
        window.location.reload();
      }
      else toast.error("Invalid data provided.");
    }
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
                  <input
                    type="text"
                    name="name"
                    placeholder="name"
                    defaultValue={name}
                    onChange={e => setName(e.target.value)}
                    {...register('name')}
                  />
                  <span>{errors?.name?.message}</span>
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="description"
                    defaultValue={description}
                    onChange={e => setDescription(e.target.value)}
                    {...register('description')}
                  />
                  <span>{errors?.description?.message}</span>
                </div>
                <div className="form-group">
                  <label htmlFor="imageUrl">Image url<span> *</span></label>
                  <input
                    type="text"
                    name="imageUrl"
                    placeholder="imageUrl"
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
          <button type="submit" className="btn btn-success" onClick={props.changed} >Confirm</button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default FormModal;