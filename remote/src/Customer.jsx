import axios from "axios";
import { useQuery } from "react-query";
import "./index.css";
import { useEffect, useRef, useState } from "react";

const Customer = () => {
  const [searchKey, setSearchKey] = useState("");
  const [customers, setCustomers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [customer, setCustomer] = useState({});
  const [activePage,setActivePage] = useState(1);
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const intermediateData = useRef(null);
  let currentPage = 1;
  const downloadCustomers = async (page) => {
    currentPage = page;
    try {
      console.log(typeof page, "page ----------------");
      if (!page) {
        setLoading(true);
      }
      const response = await axios.get(
        `https://reqres.in/api/users?page=${page || 1}`
      );
      console.log(response.data);
      setCustomers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const updateCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `https://reqres.in/api/users/${customer.id}`,form
      );
      let res = response.data;
      let _customer = {...customer,first_name:res.first_name,last_name: res.last_name,email:res.email };
      let idToRemove = _customer.id;
      let indexOfCustomer = customers.findIndex(item=>item.id==idToRemove);
        
       let _customers = [...customers];
       _customers.splice(indexOfCustomer,1);
       _customers.splice(indexOfCustomer,0,_customer);
        console.log(_customers);
        setCustomers(_customers);
        setModalOpen(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    downloadCustomers();
  }, []);
  const onSearch = (e) => {
    const queryLower = searchKey.toLowerCase();
    const results = customers.filter((user) => {
      const emailMatch = user.email.toLowerCase().includes(queryLower);
      const firstNameMatch = user.first_name.toLowerCase().includes(queryLower);
      const lastNameMatch = user.last_name.toLowerCase().includes(queryLower);

      return emailMatch || firstNameMatch || lastNameMatch;
    });
    console.log(results);
    intermediateData.current = customers;
    setCustomers(results);
  };
  useEffect(() => {
    console.log(searchKey);
  }, [searchKey]);
  const handleChangeInput = ({ target }) => {
    if (target.value == "" && intermediateData.current) {
      setCustomers(intermediateData.current);
    } else {
      setSearchKey(target.value);
    }
  };

  const handleChangeInputEdit = ({ target }) => {
    const { name, value } = target;
    setForm({ ...form, [name]: value });
  };
  return (
    <div className="main_wrpper">
      <div className="customer_container">
        <div className="input_container">
          <input
            type="text"
            placeholder="Search ..."
            onChange={handleChangeInput}
          />{" "}
          <button onClick={onSearch}>Search</button>
        </div>
        {isLoading ? (
          `Loading...`
        ) : (
          <table>
            <thead>
              <tr>
                <th>NO</th>
                <th>EMAIL</th>
                <th>NAME</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.email}</td>
                  <td>{`${user.first_name} ${user.last_name}`}</td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setModalOpen(true);
                      setCustomer(user);
                      setForm({
                        email: user.email,
                        first_name: user.first_name,
                        last_name: user.last_name,
                      });
                    }}
                  >
                    Edit
                  </td>
                </tr>
              ))}
              <tr>
                <td>{activePage!=1? <button
                    onClick={() => {
                        setActivePage(activePage-1);
                      downloadCustomers(currentPage - 1);
                    }}
                  >
                    Previous
                  </button>:<div>&nbsp;</div>}</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>
                  <button
                    onClick={() => {
                        setActivePage(activePage+1);
                      downloadCustomers(currentPage + 1);
                    }}
                  >
                    Next
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      {isModalOpen && (
        <div className="overlay">
          <div className="overlay_fixed">
            <div className="card">
              <div
                className="close"
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                x
              </div>
              <div className="edit_container">
                <div className="edit_title">Edit Customer</div>
                <div className="edit_body">
                  <div className="edit_input">
                    <label>Email</label>
                    <input
                      name="email"
                      onChange={handleChangeInputEdit}
                      value={form["email"]}
                      placeholder="Email"
                    />
                  </div>
                  <div className="edit_input">
                    <label>First name</label>
                    <input
                      name="first_name"
                      onChange={handleChangeInputEdit}
                      value={form["first_name"]}
                      placeholder="First name"
                    />
                  </div>
                  <div className="edit_input">
                    <label>Last name</label>
                    <input
                      name="last_name"
                      onChange={handleChangeInputEdit}
                      value={form["last_name"]}
                      placeholder="Last name"
                    />
                  </div>
                  <button onClick={()=>{
                    updateCustomers();
                  }}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;
