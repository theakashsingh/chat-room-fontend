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
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../redux/features/authSlice";

const SignUp = () => {
  const [inputValue, setInputValue] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    userConfirmPassword: "",
  });

  const [picture, setPicture] = useState();

  const [loading, setLoading] = useState(false);

  const [isShow, setIsShow] = useState(false);

  const toast = useToast();

  const dispatch = useDispatch();

  const user = useSelector(state => state.auth);

  let navigate = useNavigate();

  useEffect(() => {
    if (user.signup) {
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(user?.user));
      setLoading(false);
      navigate("/chats");
    }
  }, [user.user]);

  useEffect(() => {
    if (user.error) {
      toast({
        title: "Error Occurred!",
        description: user.error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }, [user.error]);

  const handleInputValue = e => {
    const { value, name } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleImagePost = async pic => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-room");
      data.append("cloud_name", "skydevil07");
      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/skydevil07/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const jsonData = await response.json();
        console.log(jsonData);
        const img = jsonData.url.toString();
        setPicture(img);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      toast({
        title: "Please Select an Valid Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const handlePasswordShow = () => {
    setIsShow(!isShow);
  };

  const submitHandler = async () => {
    setLoading(true);
    const { userName, userEmail, userPassword, userConfirmPassword } =
      inputValue;
    if (!userName || !userEmail || !userPassword || !userConfirmPassword) {
      toast({
        title: "Please Fill all the Fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (userPassword !== userConfirmPassword) {
      toast({
        title: "Password Do Not Match",
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

    dispatch(
      signupUser(
        {
          name: userName,
          email: userEmail,
          password: userPassword,
          pic: picture,
        },
        config
      )
    );
  };

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
          onChange={e => handleImagePost(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
