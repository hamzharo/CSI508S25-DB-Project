
import  {registerUser}  from "../utils/api";
import   Input   from "@/components/ui/input";
import  Button from "@/components/ui/button";
import  {Label}  from "@/components/ui/label";
import  {Checkbox}  from "@/components/ui/checkbox";
import  {useNavigate}  from "react-router-dom";
import  {useState}  from "react";

export default function RegisterForm({ email }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    citizenship: "",
    ssn: "",
    gender: "",
    phone: "",
    address: "",
    street: "",
    apt: "",
    city: "",
    country: "",
    zip: "",
    localAddressSame: "yes",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData((prevData) => ({
      ...prevData,
      termsAccepted: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.termsAccepted) {
      setError("You must accept the Terms & Conditions");
      return;
    }

    try {
      const userData = { ...formData, email };
      const result = await registerUser(userData);

      if (result.error) {
        setError(result.error);
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center">Complete Registration</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Label htmlFor="firstName">First Name</Label>
        <Input 
          id="firstName"
          type="text" 
          name="firstName" 
          required
          value={formData.firstName}
          onChange={handleChange} 
        />

        <Label htmlFor="lastName">Last Name</Label>
        <Input 
          id="lastName"
          type="text" 
          name="lastName" 
          required
          value={formData.lastName}
          onChange={handleChange} 
        />

        <Label>Date of Birth</Label>
        <Input 
          id="dob"
          type="date" 
          name="dob" 
          required 
          value={formData.dob}
          onChange={handleChange} 
        />

        <Label>Citizenship</Label>
        <Input 
          type="text" 
          name="citizenship" 
          required 
          value={formData.citizenship} 
          onChange={handleChange} 
        />

        <Label>SSN</Label>
        <Input 
          type="text" 
          name="ssn" 
          required 
          value={formData.ssn} 
          onChange={handleChange} 
        />

        <Label>Gender</Label>
        <select name="gender" required value={formData.gender} onChange={handleChange}>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <Label>Phone</Label>
        <Input 
          type="text" 
          name="phone" 
          required 
          value={formData.phone}
          onChange={handleChange} 
        />

        <Label>Address</Label>
        <Input 
          type="text" 
          name="address" 
          required 
          value={formData.address}
          onChange={handleChange} 
        />

        <Label>Street</Label>
        <Input 
          type="text" 
          name="street" 
          required 
          value={formData.street}
          onChange={handleChange} 
        />

        <Label>APT (Optional)</Label>
        <Input 
          type="text" 
          name="apt" 
          value={formData.apt}
          onChange={handleChange} 
        />

        <Label>City</Label>
        <Input 
          type="text" 
          name="city" 
          required 
          value={formData.city}
          onChange={handleChange} 
        />

        <Label>Country</Label>
        <Input 
          type="text" 
          name="country" 
          required 
          value={formData.country}
          onChange={handleChange} 
        />

        <Label>ZIP Code</Label>
        <Input 
          type="text" 
          name="zip" 
          required 
          value={formData.zip}
          onChange={handleChange} 
        />

        <div className="flex items-center space-x-2">
          {/* <Checkbox
            id="terms"
            // checked={formData.termsAccepted}
            // onCheckedChange={(checked) =>  setFormData({ ...formData, termsAccepted: checked === true }) } 
          /> */}
          <Checkbox
            id="terms"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                termsAccepted: checked === true,
              }))
            }
          />
          <Label htmlFor="terms">
            I accept the <a href="/terms" className="text-blue-500 underline">Terms & Conditions</a>
          </Label>
        </div>

        

        <Label>Create Password</Label>
        <Input 
          type="password" 
          name="password" 
          required 
          value={formData.password}
          onChange={handleChange} 
        />

        <Label>Confirm Password</Label>
        <Input 
          type="password" 
          name="confirmPassword" 
          required 
          value={formData.confirmPassword}
          onChange={handleChange} 
        />

        <Button type="submit" className="w-full">Register</Button>
      </form>
    </div>
  );
}
