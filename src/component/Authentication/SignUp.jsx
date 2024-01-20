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

const SignUp = () => {
  const [inputValue, setInputValue] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    userConfirmPassword: "",
  });

  const [isShow, setIsShow] = useState(false);

  const handleInputValue = e => {
    const { value, name } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handlePasswordShow = () => {
    setIsShow(!isShow);
  };

  const submitHandler = () => {};

  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          name="userName"
          value={inputValue.userName}
          placeholder="Enter Your Name"
          onChange={handleInputValue}
        />
      </FormControl>
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
      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={isShow ? "text" : "password"}
            name="userConfirmPassword"
            value={inputValue.userConfirmPassword}
            placeholder="Confirm Password"
            onChange={handleInputValue}
          />
          <InputRightElement>
            <Button h="1.75rem" size="sm" onClick={handlePasswordShow}>
              {isShow ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic" isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          // name="userEmail"
          // value={inputValue.userEmail}
          accept="image/*"
          onChange={handleInputValue}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
