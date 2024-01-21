import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/features/authSlice";

const Login = () => {
  const [inputValue, setInputValue] = useState({
    userEmail: "",
    userPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const toast = useToast();
  const user = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.login) {
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(user.user));
      setLoading(false);
      navigate("/chats");
    }
  }, [user.user]);

  useEffect(() => {
    if (user.error) {
      toast({
        title: "error occurred",
        description: user.error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  }, [user.error]);

  const handleInputValue = e => {
    const { value, name } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleGuestCredentials = () => {
    setInputValue({ userEmail: "guest@example.com", userPassword: "123456" });
  };

  const handlePasswordShow = () => {
    setIsShow(!isShow);
  };

  const submitHandler = async () => {
    setLoading(true);
    const { userEmail, userPassword } = inputValue;
    if (!userEmail || !userPassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    dispatch(loginUser({ email: userEmail, password: userPassword }, config));
  };

  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          name="userEmail"
          value={inputValue.userEmail}
          placeholder="Enter Your Email"
          onChange={handleInputValue}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={isShow ? "text" : "password"}
            name="userPassword"
            value={inputValue.userPassword}
            placeholder="Enter Your Password"
            onChange={handleInputValue}
          />
          <InputRightElement>
            <Button h="1.75rem" size="sm" onClick={handlePasswordShow}>
              {isShow ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handleGuestCredentials}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
