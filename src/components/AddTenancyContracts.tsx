import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import {
  Add_TenancyContractOwner,
  Add_TenancyContractTenant,
  Add_TenancyContractProperty
} from "../constants/inputdata";
import Input from "./TextInput";
import { useEffect, useState } from "react";
import { fetchProperty, getPropertyList } from "../api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Checkbox from "./CheckBox";

const AddTenancyContracts = () => {
  const [property, setProperty] = useState();
  const [checked, setChecked] = useState<boolean>(false);
  const [propertyList, setPropertyList] = useState<any[]>([]);

  const [formValues, setFormValues] = useState<{ [key: string]: string }>({
    anualPriceRent: "",
    securityDeposite: "",
    securityDepositeAmt: "",
    brokarage: "",
    brokarageAmt: "",
  });
  const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => {
      const newValues = { ...prevValues, [name]: value };

      // Trigger calculation after updating state
      if (
        name === "anualPriceRent" ||
        (name === "securityDeposite" && selectedCheckbox === "securityDeposite") ||
        (name === "brokarage" && selectedCheckbox === "brokarage")
      ) {
        calculateAmounts(newValues);
      }

      return newValues;
    });
  };

  const calculateAmounts = (currentValues: { [key: string]: string }) => {
    const anualPriceRent = parseFloat(currentValues.anualPriceRent);
    const securityDepositePercentage = parseFloat(currentValues.securityDeposite);
    const brokaragePercentage = parseFloat(currentValues.brokarage);

    let calculatedSecurityDepositeAmt = "";
    let calculatedBrokarageAmt = "";

    // Calculate Security Deposite Amount if checkbox is selected
    if (selectedCheckbox === "securityDeposite" && !isNaN(anualPriceRent) && !isNaN(securityDepositePercentage)) {
      calculatedSecurityDepositeAmt = ((anualPriceRent * securityDepositePercentage) / 100).toFixed(2);
    }

    // Calculate Brokarage Amount if checkbox is selected
    if (selectedCheckbox === "brokarage" && !isNaN(anualPriceRent) && !isNaN(brokaragePercentage)) {
      calculatedBrokarageAmt = ((anualPriceRent * brokaragePercentage) / 100).toFixed(2);
    }

    // Update form values with calculated amounts
    setFormValues(prevValues => ({
      ...prevValues,
      securityDepositeAmt: calculatedSecurityDepositeAmt,
      brokarageAmt: calculatedBrokarageAmt,
    }));
  };

  const handleCheckboxChange = (name: string) => {
    const newSelectedCheckbox = selectedCheckbox === name ? null : name;
    setSelectedCheckbox(newSelectedCheckbox);

    // Recalculate amounts based on the selected checkbox
    if (newSelectedCheckbox) {
      calculateAmounts({ ...formValues });
    } else {
      // Clear the calculated values if no checkbox is selected
      setFormValues(prevValues => ({
        ...prevValues,
        securityDepositeAmt: "",
        brokarageAmt: "",
      }));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await getPropertyList();
    const item = res?.data?.data.map(
      (item: { property: any }) => item.property
    );
    setPropertyList(item);
  };

  //console.log("unitList => ", propertyList);

  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-2`}>
          <div className="my-5 px-2 ">
            <Header />
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <p className="flex gap-2 text-[18px] text-[#7C8DB5] mb-4">
                  <span className="pb-1 border-b border-[#7C8DB5]">Property</span>
                  <span className="pb-1">Details</span>
                </p>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                <Select>
                    <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none mt-7">
                      <div className="flex items-center">
                        <SelectValue placeholder="Name Of Property" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {propertyList.map((item, i) => (
                        <SelectItem key={i} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none mt-7">
                      <div className="flex items-center">
                        <SelectValue placeholder="No. of Cheques" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {['1','2'].map((item, i) => (
                        <SelectItem key={i} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none mt-7">
                      <div className="flex items-center">
                        <SelectValue placeholder="Type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {['Commercial','Residencial'].map((item, i) => (
                        <SelectItem key={i} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {Add_TenancyContractProperty.map(({ label, name, type }) => (
                    <div key={name}>
                      <Input
                        key={name}
                        label={label}
                        name={name}
                        type={type}
                        value={formValues[name] || ""}
                        onChange={handleInputChange}
                        disabled={name === "securityDepositeAmt" || name === "brokarageAmt"}
                        borderd
                        bgLight
                      />
                      {(name === "brokarage" || name === "securityDeposite") && (
                        <Checkbox
                          label={`% value of Rent`}
                          checked={selectedCheckbox === name}
                          onChange={() => handleCheckboxChange(name)}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <p className="flex gap-2 text-[18px] text-[#7C8DB5] mt-8 mb-4">
                  <span className="pb-1 border-b border-[#7C8DB5]">Tenant</span>
                  <span className="pb-1">Details</span>
                </p>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                  
                  {Add_TenancyContractTenant.map(({ label, name, type }) => (
                    <Input
                      key={name}
                      label={label}
                      name={name}
                      type={type}
                      value={""}
                      onChange={() => {}}
                      borderd
                      bgLight
                    />
                  ))}
                </div>
                <p className="flex gap-2 mt-8 mb-4 text-[18px] text-[#7C8DB5]">
                  <span className="pb-1 border-b border-[#7C8DB5]">Owner</span>
                  <span className="pb-1">Details</span>
                </p>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6">
                  {Add_TenancyContractOwner.map(({ label, name, type }) => (
                    <Input
                      key={name}
                      label={label}
                      name={name}
                      type={type}
                      value={""}
                      onChange={() => {}}
                      borderd
                      bgLight
                    />
                  ))}
                </div>
                <div className="max-w-[100px]">
                  <PrimaryButton title="Save" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddTenancyContracts;
