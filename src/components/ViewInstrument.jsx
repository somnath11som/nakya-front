import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import instrumentImg from "../assets/Images/manageInstru/instru.png";
import editIcon from "../assets/Images/manageInstru/editicon2.png";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import backIcon from "../assets/Images/manageInstru/backIcon.png";
import TiptapEditor from "./TiptapEditor";

const ViewInstrument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instrument, setInstrument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState(null);

  let tokens = useSelector((state) => state.token) || localStorage.getItem("token");
  tokens = tokens?.replace(/"/g, "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setSelectedInstrument({
          ...selectedInstrument,
          photo: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const editHandler = async () => {
    setUpdateLoading(true);
    try {
      const editUrl = `https://crp.mydevfactory.com/api/users/instruments/${id}/`;
      const formData = new FormData();

      if (selectedInstrument?.photo instanceof File) {
        formData.append("photo", selectedInstrument.photo);
      }

      const fieldsToUpdate = {
        name: selectedInstrument.name,
        category: selectedInstrument.category,
        is_available: selectedInstrument.is_available,
        ins_des: selectedInstrument.ins_des,
      };

      Object.keys(fieldsToUpdate).forEach((key) => {
        formData.append(key, fieldsToUpdate[key]);
      });

      await axios.put(editUrl, formData, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const response = await axios.get(editUrl, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          "Content-Type": "application/json",
        },
      });
      setInstrument(response.data);
      setIsEditModalOpen(false);
      toast.success("Instrument updated successfully!");
    } catch (error) {
      console.error("Error updating instrument:", error);
      toast.error("Failed to update instrument");
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    const fetchInstrument = async () => {
      try {
        const response = await axios.get(`https://crp.mydevfactory.com/api/users/instruments/${id}/`, {
          headers: {
            Authorization: `Bearer ${tokens}`,
            "Content-Type": "application/json",
          },
        });
        setInstrument(response.data);
        setSelectedInstrument(response.data);
        setPreviewImage(`https://crp.mydevfactory.com/${response.data.photo}`);
      } catch (error) {
        console.error("Error fetching instrument:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && tokens) {
      fetchInstrument();
    }
  }, [id, tokens]);

  if (loading) {
    return (
      <Layout title="Instrument Details">
        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-xl text-[#BBA14F]">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={
        <div className="flex items-center gap-2">
          <div className="border border-[#BBA14F] rounded-full p-3">
            <img src={backIcon} alt="Back" className="h-5 w-5 cursor-pointer" onClick={() => navigate(-1)} />
          </div>
          <span>Instrument Details</span>
        </div>
      }
    >
      <div className="border border-[#202020] rounded-lg overflow-x-auto max-h-[calc(100vh-24vh)] overflow-auto scrollbar-hide">
        <div className="bg-[#292929] text-white p-6 rounded-lg shadow-md mx-auto">
          {/* Instrument Image & Details */}
          <div className="flex flex-col md:flex-row gap-28">
            {/* Image Section */}
            <div className="md:w-[40%] w-full py-4">
              <img
                src={instrument?.photo ? `https://crp.mydevfactory.com/${instrument.photo}` : "https://placehold.co/600x400"}
                alt={instrument?.name || "Instrument"}
                className="w-full rounded-lg"
              />
            </div>

            {/* Details Section */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-[#BBA14F]">{instrument?.is_available || "Status Not Available"}</h1>
                  <h2 className="text-xl font-semibold text-white">{instrument?.name || "Instrument Name"}</h2>

                  <div
                    className="prose prose-invert max-w-none mt-2   [&_h1]:text-[16px] [&_h1]:text-[#989898] [&_h1]:font-normal [&_p]:text-white"
                    dangerouslySetInnerHTML={{ __html: instrument?.ins_des || "Description Not Available" }}
                  />
                </div>
                <button className="bg-[#BBA14F] text-black px-4 py-2 rounded-md hover:bg-[#9D8A3F] flex items-center gap-2" onClick={() => setIsEditModalOpen(true)}>
                  <img src={editIcon} alt="Edit" className="w-4 h-4" />
                  <span className="text-sm text-white">Edit</span>
                </button>
              </div>

              {/* Feature List */}
            </div>
          </div>

          {/* Technical Details Section */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
            <div>
              <p className="text-gray-500">Application type(s):</p>
              <p>Cell count & viability for mammalian cells</p>
            </div>
            <div>
              <p className="text-gray-500">Cell type(s):</p>
              <p>Mammalian cells, PBMCs, whole blood, T-cells, & more</p>
            </div>
            <div>
              <p className="text-gray-500">Software:</p>
              <p>NucleoView™</p>
            </div>
            <div>
              <p className="text-gray-500">Consumable(s):</p>
              <p>Vial–Cassette™</p>
            </div>
            <div>
              <p className="text-gray-500">Capacity (Analysis time):</p>
              <p>50 sec (one step), 120 sec (two steps)</p>
            </div>
            <div>
              <p className="text-gray-500">Loading volume:</p>
              <p>60 µl</p>
            </div>
            <div>
              <p className="text-gray-500">Analysis volume:</p>
              <p>1.4 µl</p>
            </div>
            <div>
              <p className="text-gray-500">Optional range:</p>
              <p>5×10⁴ to 5×10⁶ cells/ml</p>
            </div>
            <div>
              <p className="text-gray-500">Staining dye(s):</p>
              <p>Acridine orange (AO), DAPI</p>
            </div>
            <div>
              <p className="text-gray-500">Excitation:</p>
              <p>2 LED light sources at 365 nm & 505 nm</p>
            </div>
            <div>
              <p className="text-gray-500">Emission (nm):</p>
              <p>410–460 nm & 540–650 nm</p>
            </div>
            <div>
              <p className="text-gray-500">Optics:</p>
              <p>Lens with x1.3 magnification, 1/2" CMOS camera</p>
            </div>
            <div>
              <p className="text-gray-500">Data output:</p>
              <p>Images, tables, histograms, scatter plots</p>
            </div>
            <div>
              <p className="text-gray-500">Data export formats:</p>
              <p>.cm, .csv, .pdf, .cmp, .bmp, .tiff</p>
            </div>
            <div>
              <p className="text-gray-500">Product Number:</p>
              <p>900-0200</p>
            </div>
            <div>
              <p className="text-gray-500">Size:</p>
              <p>40 x 23 x 25 cm</p>
            </div>
            <div>
              <p className="text-gray-500">Weight:</p>
              <p>4.5 kg (9.9 lb)</p>
            </div>
            <div>
              <p className="text-gray-500">Supply voltage:</p>
              <p>24VDC (100-240V ~ 50-60Hz)</p>
            </div>
          </div> */}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedInstrument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[800px] p-8 relative">
            <div className="absolute top-0 right-0 bg-[#b89e5a] p-3.5 rounded-bl-3xl"></div>

            <button className="hover:text-black text-white absolute right-1 top-0 z-10" onClick={() => setIsEditModalOpen(false)}>
              ✕
            </button>

            <h3 className="text-center text-xl font-bold mb-6 text-black">Edit Instrument</h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <label
                  htmlFor="edit-file-upload"
                  className="border-dashed border-2 border-[#BBA14F] p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer w-full h-32"
                >
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <>
                      <p className="text-[#BBA14F] text-sm font-semibold">Upload Profile Image</p>
                      <p className="text-xs text-gray-500">Support: JPEG, PDF 15 MB</p>
                    </>
                  )}
                </label>
                <input id="edit-file-upload" type="file" className="hidden" accept="image/jpeg, image/png" onChange={handleImageChange} />
              </div>

              <div className="flex flex-col space-y-4 text-black">
                <input
                  type="text"
                  value={selectedInstrument?.name}
                  onChange={(e) =>
                    setSelectedInstrument({
                      ...selectedInstrument,
                      name: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none w-full"
                />

                <select
                  className="p-2 border border-gray-300 rounded-lg w-full"
                  value={selectedInstrument.is_available}
                  onChange={(e) =>
                    setSelectedInstrument({
                      ...selectedInstrument,
                      is_available: e.target.value,
                    })
                  }
                >
                  <option value={"AVAILABLE"}>Available</option>
                  <option value={"IN_USE"}>In Use</option>
                  <option value={"UNDER_MAINTAINENCE"}>Under Maintenance</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <select
                className="p-2 border border-gray-300 text-black rounded-lg w-full"
                value={selectedInstrument.category}
                onChange={(e) =>
                  setSelectedInstrument({
                    ...selectedInstrument,
                    category: e.target.value,
                  })
                }
              >
                <option value="STRING_INSTRUMENTS">String Instrument</option>
                <option value="WIND_INSTRUMENTS">Wind Instrument</option>
                <option value="PERCUSSION">Percussion</option>
                <option value="ELECTRONIC">Electronic</option>
              </select>

              <TiptapEditor
                content={selectedInstrument.ins_des}
                onChange={(newContent) =>
                  setSelectedInstrument({
                    ...selectedInstrument,
                    ins_des: newContent,
                  })
                }
              />
            </div>

            <div className="mt-6 text-center">
              <button className="bg-[#BBA14F] text-black p-2 px-6 rounded-lg hover:bg-yellow-600 disabled:opacity-50" onClick={editHandler} disabled={updateLoading}>
                {updateLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ViewInstrument;
