// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { ChangeEvent, useEffect, useState } from "react";
import { Add_Property } from "../constants/inputdata";
import Input from "./TextInput";
import { createProperty, fetchProfileData, updateProfile, uploadFile } from "../api";
import { useNavigate } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

interface FormData {
    firstName: string;
    lastName: string;
    emailAddress: string;
    contactNo: string;
    Dob: string;
    Address: string;
    city: string;
    country: string;
    imageAttachment?: File;
}

const Profile = () => {
    const [_, setSelectedFile] = useState<File | null>(null);
    const [imgUrl, setImgUrl] = useState("");
    const [load,setLoad]=useState(false)
    const navigate = useNavigate();
    useEffect(() => {
        const getData = async () => {
            const res = await fetchProfileData()
            const item = res?.data?.data[2]
            console.log(item, "bft")
            if (item) {
                setFormData((prevData) => {
                    return {
                        ...prevData,
                        firstName: item?.first_name,
                        lastName: item?.last_name,
                        emailAddress: item?.email,
                        contactNo: item?.mobile_no,
                        Dob: item?.birth_date,
                        Address: item?.address,
                        city: item?.location,
                        country: item?.country,
                        name:item?.name
                    };
                });
                setImgUrl(item?.image || "");

            }
        }
        getData()
    }, [])
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            setSelectedFile(file);

            if (file) {
                const res = await uploadFile(file);
                console.log('reaeq2asd', res)
                setImgUrl(res?.data?.message?.file_url);
            }
        }
    };

    const [formData, setFormData] = useState<FormData>({
    });
    const handleDropDown = (name, item) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: item,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(name,value,"bft")
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('13e2qdwas', imgUrl)
        setLoad(false)
        try {
            console.log("API Data => ", formData);
            const res = await updateProfile({
                first_name:formData?.firstName,
                last_name:formData?.lastName,
                email:formData?.emailAddress,
                mobile_no:formData?.contactNo,
                birth_date:formData?.Dob,
                location:formData?.city,
                address:formData?.Address,
                country:formData?.country,
                image: imgUrl,
            },formData?.name);
            console.log("res,res", res);
            if (res) {
                setLoad(true)
                navigate("/profile");
            }
        } catch (err) {
            setLoad(false)
            console.log(err);
        }
    };

    return (
        <main>
            <div className="flex">
                <Sidebar />
                <div className={`flex-grow ml-80 my-5 px-2`}>
                    <div className="my-5 px-2 ">
                        <Header name="Profile" load={load} />
                        <div>
                            <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                                <div className="flex items-center justify-center mb-5">
                                    <img
                                        className="w-50px h-50px rounded-md"
                                        src={imgUrl
                                            ? `https://propms.erpnext.syscort.com/${imgUrl}`
                                            : "/defaultProperty.jpeg"}
                                        alt="propertyImg"
                                        style={{ height: '200px', width: '200px', borderRadius: '100px' }}
                                    />
                                </div>
                                <form onSubmit={handleSubmit}>

                                    <div className="grid grid-cols-[repeat(auto-fit,minmax(420px,1fr))] gap-4">
                                        <Input
                                            key={"firstName"}
                                            label={"First Name"}
                                            name={"firstName"}
                                            type={"text"}
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            borderd
                                            bgLight
                                        />
                                        <Input
                                            key={"lastName"}
                                            label={"Last Name"}
                                            name={"lastName"}
                                            type={"text"}
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            borderd
                                            bgLight
                                        />
                                        <Input
                                            key={"email"}
                                            label={"Email"}
                                            name={"emailAddress"}
                                            type={"text"}
                                            value={formData.emailAddress}
                                            onChange={handleChange}
                                            borderd
                                            bgLight
                                        />
                                        <Input
                                            key={"contact"}
                                            label={"Contact No."}
                                            name={"contactNo"}
                                            type={"text"}
                                            value={formData.contactNo}
                                            onChange={handleChange}
                                            borderd
                                            bgLight
                                        />
                                        <Input
                                            key={"dob"}
                                            label={"Date of birth"}
                                            name={"Dob"}
                                            type={"date"}
                                            value={formData.Dob}
                                            onChange={handleChange}
                                            borderd
                                            bgLight
                                        />
                                        <Input
                                            key={"address"}
                                            label={"Address"}
                                            name={"Address"}
                                            type={"text"}
                                            value={formData.Address}
                                            onChange={handleChange}
                                            borderd
                                            bgLight
                                        />
                                        <Input
                                            key={"city"}
                                            label={"City"}
                                            name={"city"}
                                            type={"text"}
                                            value={formData.city}
                                            onChange={handleChange}
                                            borderd
                                            bgLight
                                        />
                                        <Input
                                            key={"country"}
                                            label={"Country"}
                                            name={"country"}
                                            type={"text"}
                                            value={formData.country}
                                            onChange={handleChange}
                                            borderd
                                            bgLight
                                        />
                                        <div>
                                            <p className="mb-1.5 ml-1 font-medium text-gray-700">
                                                <label>Image Attachment</label>
                                            </p>
                                            <div
                                                className={`flex items-center gap-3 p-1.5 bg-white border border-[#CCDAFF] rounded-md overflow-hidden`}
                                            >
                                                <input
                                                    className={`w-full bg-white outline-none`}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 max-w-[100px]">
                                        <PrimaryButton title="Save" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Profile;
