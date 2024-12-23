"use client";

import { useEffect, useState } from "react";
import { AuthenticationToken } from "@/state/store";
import { useSnapshot } from "valtio";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Input from "@mui/joy/Input";
import Key from "@mui/icons-material/Key";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MuiPhoneNumber from "mui-phone-number";
import { useMutation } from "@apollo/client";
import { gql } from "@/__generated__";

const SCHOOL_LOGIN_MUTATION = gql(`
mutation schoolLogin($schoollogin: SchoolLogin!) {   
  schoolLogin(input: $schoollogin) 
}
`);

export default function Detail() {
  const snap = useSnapshot(AuthenticationToken);

  const [phonenumber, setPhoneNumber] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChangePhoneNumber = (value: any) => {
    setPhoneNumber(value);
  };

  const handleChangePassword = (event: any) => {
    setPassword(event.target.value);
  };

  const [schoolLogin, { data, loading, error }] = useMutation(
    SCHOOL_LOGIN_MUTATION
  );

  useEffect(() => {
    const data = window.localStorage.getItem("AuthenticationToken");
    if (data !== null) {
      const Parseddata: string = JSON.parse(data);
      AuthenticationToken.token = Parseddata;
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("AuthenticationToken", JSON.stringify(snap.token));
  }, [snap.token]);

  
  useEffect(() => {
    if (data !== undefined && data !== null){
    AuthenticationToken.token = data.schoolLogin
    }
  }, [data]);


  return (
    <div className="max-md:px-2">
      <Stack spacing={1}>
        <MuiPhoneNumber
          onChange={handleChangePhoneNumber}
          defaultCountry={"ke"}
          onlyCountries={["ke"]}
          countryCodeEditable={false}
          value={phonenumber}
        />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Enter password in here…"
          startDecorator={<Key />}
          endDecorator={
            showPassword ? (
              <div className="cursor-pointer">
                <VisibilityOff onClick={handleClickShowPassword} />
              </div>
            ) : (
              <div className="cursor-pointer">
                <Visibility onClick={handleClickShowPassword} />
              </div>
            )
          }
          onChange={handleChangePassword}
          value={password}
        />
        <div className="grid grid-cols-2">
          <p className="text-sky-600 cursor-pointer text-center">
            Forgot password?
          </p>
          <p className="text-sky-600 cursor-pointer text-center">
            Create an account
          </p>
        </div>
        <div className="text-red-600 mb-4 text-center">{error?.message}</div>
        <Button
          type="submit"
          color="primary"
          sx={{
            "&.MuiButton-colorPrimary": {
              backgroundColor: "#3B0764",
              "&:hover": {
                backgroundColor: "#581C87",
              },
            },
          }}
          disabled={phonenumber.length != 13}
          loading={loading}
          onClick={(e) => {
            e.preventDefault();
            schoolLogin({
              variables: {
                schoollogin: {
                  phone_number: phonenumber,
                  password: password,
                },
              },
            }).catch((res) => {
              const errors = res.graphQLErrors.map((error: any) => {
                console.log(error.message);
              });
            });
          }}
        >
          Sign in
        </Button>
      </Stack>
    </div>
  );
}
