import { Box, Container, TabList, Tabs, Tab, TabPanels, TabPanel, Text } from "@chakra-ui/react";
import Login from "../component/Authentication/Login";
import SignUp from "../component/Authentication/SignUp";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats")
    }
  }, [navigate])
  
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="work sans" color="black">
          Own Chat Room
        </Text>
      </Box>
      <Box bg="white" w="100%" p="4" borderRadius="lg" textColor="black" borderWidth="1px">
        <Tabs variant='soft-rounded' >
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
             <Login/>
            </TabPanel>
            <TabPanel>
              <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
