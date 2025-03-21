import { useParams, Link } from "react-router-dom";
import InputField from "../../components/InputField";
import FieldList from "../../components/FieldList";
import { useForm } from "../../hooks/useForm";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useStrain } from "../../hooks/useStrain";
import { useUpdateStrain } from "../../hooks/useStrainMutation";
import { useHandleError } from "../../hooks/useHandleError";
import { useCheckEditPermission } from "../../hooks/useCheckEditPermission";
import Loader from "../../components/Loader";
import { useEffect } from "react";

export default function EditStrain() {
  const { id } = useParams();
  console.log(id);
  const {
    data: hasEditPermission,
    isLoading: editPermissionLoading,
    error: editPermissionError,
  } = useCheckEditPermission(id);
  useHandleError(editPermissionError, hasEditPermission === false);
  const { data, isLoading, error } = useStrain(id);

  // const strain = data?.strain;
  const updateStrainMutation = useUpdateStrain(id);
  const [formData, handleChange, setFormData] = useForm({
    strain: "",
    dept: "",
    abbr: "",
    iacuc_no: "",
    EXP: "",
    genes: [],
    users: [],
  });
  const { validated, validateForm } = useFormValidation();
  useEffect(() => {
    if (data) {
      setFormData(data.strain);
    }
  }, [data]);

  useHandleError(error);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;
    const { _id, mice, breedingRecords, __v, ...rest } = formData;
    const strain = {
      ...rest,
    };
    await updateStrainMutation.mutateAsync(strain);
  };

  if (isLoading || editPermissionLoading) {
    return <Loader />;
  }

  return (
    <div className="row">
      <h1 className="text-center">編輯實驗計畫資訊</h1>
      <div className="col-10 offset-1">
        <form
          noValidate
          onSubmit={handleSubmit}
          className={`validated-form ${
            validated ? "was-validated" : ""
          } shadow-lg mb-3 p-4 rounded-3`}
        >
          <InputField
            label="計畫單位(必填)"
            id="dept"
            name="dept"
            value={formData?.dept}
            onChange={handleChange}
            className="col"
          />

          <InputField
            label="品系名稱(必填)"
            id="strain"
            name="strain"
            value={formData?.strain}
            onChange={handleChange}
            className="col"
          />

          <InputField
            label="品系縮寫(必填)"
            id="abbr"
            name="abbr"
            value={formData?.abbr}
            onChange={handleChange}
            className="col"
          />

          <InputField
            label="IACUC編號(必填)"
            id="iacuc_no"
            name="iacuc_no"
            value={formData?.iacuc_no}
            onChange={handleChange}
            className="col"
          />

          <InputField
            type="date"
            label="計畫期限(必填)"
            id="EXP"
            name="EXP"
            value={
              formData?.EXP
                ? new Date(formData.EXP).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
            className="col"
          />

          <FieldList
            FieldListName="採樣基因"
            fields={
              formData.genes?.map((gene, index) => ({
                id: index,
                name: gene,
              })) || []
            }
            onFieldChange={(updatedFields) => {
              const updatedGenes = updatedFields.map((field) => field.name);
              setFormData((prev) => ({
                ...prev,
                genes: updatedGenes,
              }));
            }}
          />

          <FieldList
            FieldListName="計畫人員"
            fields={
              formData.users?.map((user, index) => ({
                id: index,
                name: user,
              })) || []
            }
            onFieldChange={(updatedFields) => {
              const updatedUsers = updatedFields.map((field) => field.name);
              setFormData((prev) => ({
                ...prev,
                users: updatedUsers,
              }));
            }}
          />

          <div className="mt-5 my-3 d-flex justify-content-end">
            <button className="warning">提交變更</button>
          </div>
          <div className="d-flex justify-content-end">
            <button className="danger">
              <Link to={`/strains/${id}`} className="link">
                取消，返回實驗計畫
              </Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
