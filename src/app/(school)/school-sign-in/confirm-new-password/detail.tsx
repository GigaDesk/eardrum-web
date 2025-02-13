"use client";

import { gql } from "@/__generated__/gql";
import InputPasswordConfirmation from "@/components/Input/inputpasswordconfirmation";
import { useMutation } from "@apollo/client";
import Button from "@mui/joy/Button";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import {
  ForgotSchoolPassword,
  ForgotSchoolPasswordInstance,
} from "../../state/store";
import { useRouter } from "next/navigation";

const RESET_SCHOOL_PASSWORD_MUTATION = gql(`
   mutation resetSchoolPassword($new_password: String!){
    resetSchoolPassword(new_password: $new_password){
      id
    }
  }
 `);

export default function Detail() {
  const router = useRouter();

  const forgotschoolpasswordinstance = useSnapshot(
    ForgotSchoolPasswordInstance
  );

  const [password, setPassword] = useState("");

  const handleChangePassword = (event: any) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    const data = window.localStorage.getItem("ForgotSchoolPassword");
    if (data !== null) {
      const Parseddata: ForgotSchoolPassword = JSON.parse(data);
      ForgotSchoolPasswordInstance.instance = Parseddata;
    }
  }, []);

  const [resetSchoolPassword, { loading, error, data }] = useMutation(
    RESET_SCHOOL_PASSWORD_MUTATION
  );

  useEffect(() => {
    if (data !== undefined && data !== null) {
      window.localStorage.setItem("LastSignedInAs", JSON.stringify("school"));
      window.localStorage.setItem("LastSignInDate", JSON.stringify(new Date()));
      router.push(`/school`);
    }
  }, [data]);

  return (
    <div className="grid">
      <InputPasswordConfirmation
        handlechange={handleChangePassword}
        expectedValue={forgotschoolpasswordinstance.instance.newpassword}
      />
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
        disabled={password != forgotschoolpasswordinstance.instance.newpassword}
        onClick={(e) => {
          e.preventDefault();
          resetSchoolPassword({
            variables: {
              new_password: forgotschoolpasswordinstance.instance.newpassword,
            },
          }).catch((res) => {
            const errors = res.graphQLErrors.map((error: any) => {
              console.log(error.message);
            });
          });
        }}
        loading={loading}
      >
        Reset password
      </Button>
    </div>
  );
}
