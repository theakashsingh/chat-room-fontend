import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

const Login = () => {
  const [inputValue, setInputValue] = useState({
    userEmail: "",
    userPassword: "",
  });

  const [isShow, setIsShow] = useState(false);

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

  const submitHandler = () => {};

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
