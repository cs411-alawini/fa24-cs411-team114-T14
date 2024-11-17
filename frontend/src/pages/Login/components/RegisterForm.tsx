import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Alert, Button, Form } from "react-bootstrap";
import { useState } from "react";
import {
  selectAuthUserIsLoading,
  selectAuthUserError,
} from "../../../services/auth/AuthSelectors";
import RegisterInput from "../../../types/auth/RegisterInput";
import { register as authRegister } from "../../../services/auth/AuthSlice";
import { selectCitizenships } from "../../../services/country/CountrySelectors";

const RegisterFormSchema = z.object({
  username: z.string().min(3, "Username is required"),
  email: z.string().email(),
  password: z.string().min(3, "Password is required"),
  PrimaryCitizenship: z.string().min(1, "Primary citizenship is required"),
});
type RegisterFormSchemaType = z.infer<typeof RegisterFormSchema>;

function RegisterForm(): JSX.Element {
  const [isRegisterSuccess, setIsRegisterSuccess] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(RegisterFormSchema),
  });
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthUserIsLoading);
  const error = useAppSelector(selectAuthUserError);
  const citizenshipMap = useAppSelector(selectCitizenships);
  const onSubmit = async (data: RegisterFormSchemaType) => {
    const userRegisterInput: RegisterInput = {
      username: data.username,
      email: data.email,
      password: data.password,
      primaryCitizenship: parseInt(data.PrimaryCitizenship),
    };
    if (!isLoading) {
      try {
        await dispatch(authRegister(userRegisterInput)).then((resultAction) => {
          if (authRegister.fulfilled.match(resultAction)) {
            reset();
            setIsRegisterSuccess(true);
          } else {
            setIsRegisterSuccess(false);
          }
        });
      } catch (err) {
        setIsRegisterSuccess(false);
      }
    }
  };

  return (
    <Form className="container mt-3 mb-3" onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          {...register("username")}
          isInvalid={errors.username !== undefined}
        />
        <Form.Control.Feedback type="invalid">
          {errors.username?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="text"
          {...register("email")}
          isInvalid={errors.email !== undefined}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          {...register("password")}
          isInvalid={errors.password !== undefined}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="primaryCitizenship">
        <Form.Label>Primary Citizenship</Form.Label>
        <Form.Select
          {...register("PrimaryCitizenship")}
          isInvalid={errors.PrimaryCitizenship !== undefined}
        >
          <option value="">Select a citizenship...</option>
          {citizenshipMap &&
            Object.entries(citizenshipMap).map(([country, id]) => (
              <option key={id} value={id}>
                {country}
              </option>
            ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.PrimaryCitizenship?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Button className="w-100" type="submit">
        Register
      </Button>
      {error && (
        <Alert className="mt-3 mb-3" variant="danger">
          {error}
        </Alert>
      )}
      {isLoading && (
        <Alert className="mt-3 mb-3" variant="info">
          Loading...
        </Alert>
      )}
      {isRegisterSuccess && (
        <Alert className="mt-3 mb-3" variant="info">
          User registered successfully!
        </Alert>
      )}
    </Form>
  );
}

export default RegisterForm;
