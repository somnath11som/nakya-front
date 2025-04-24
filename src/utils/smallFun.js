export const checkTypeArr = (data) => {
  return data && Array.isArray(data) && data.length > 0;
};

export const inputTypeChange = (e, form, setForm) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
};

export const inputFileChange = (e, form, setForm) => {
  const { name } = e.target;
  setForm({ ...form, [name]: e.target.files[0] });
};
