import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCitizenships } from "../../../services/country/CountrySelectors";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, ButtonGroup, Col, Form, Row } from "react-bootstrap";
import {
  selectUserInputsError,
  selectUserInputsIsLoading,
} from "../../../services/userinput/UserInputSelectors";
import { useEffect, useState } from "react";
import AddUserInput from "../../../types/userinput/AddUserInput";
import {
  fetchUserInputs,
  putUserInput,
  postUserInput,
} from "../../../services/userinput/UserInputSlice";
import UserInput from "../../../types/userinput/UserInput";
import EditUserInput from "../../../types/userinput/EditUserInput";
import { useNavigate } from "react-router";
import { dashboardFeedback } from "../../../routes";

const UserInputFormSchema = z
  .object({
    country: z.string().min(1, "Country is required"),
    dateVisitedFrom: z.string().date("Date visited from is required"),
    dateVisitedTo: z.string().date("Date visited to is required"),
    foodRating: z
      .number()
      .int()
      .min(1, "Food rating must be between 1 and 10")
      .max(10, "Food rating must be between 1 and 10"),
    hospitalRating: z
      .number()
      .int()
      .min(1, "Hospital rating must be between 1 and 10")
      .max(10, "Hospital rating must be between 1 and 10"),
    climateRating: z
      .number()
      .int()
      .min(1, "Climate rating must be between 1 and 10")
      .max(10, "Climate rating must be between 1 and 10"),
    tourismRating: z
      .number()
      .int()
      .min(1, "Tourism rating must be between 1 and 10")
      .max(10, "Tourism rating must be between 1 and 10"),
    safetyRating: z
      .number()
      .int()
      .min(1, "Safety rating must be between 1 and 10")
      .max(10, "Safety rating must be between 1 and 10"),
    costOfLivingRating: z
      .number()
      .int()
      .min(1, "Cost of living rating must be between 1 and 10")
      .max(10, "Cost of living rating must be between 1 and 10"),
    cultureEntertainmentRating: z
      .number()
      .int()
      .min(1, "Culture and entertainment rating must be between 1 and 10")
      .max(10, "Culture and entertainment rating must be between 1 and 10"),
    infrastructureRating: z
      .number()
      .int()
      .min(1, "Infrastructure rating must be between 1 and 10")
      .max(10, "Infrastructure rating must be between 1 and 10"),
    healthcareRating: z
      .number()
      .int()
      .min(1, "Healthcare rating must be between 1 and 10")
      .max(10, "Healthcare rating must be between 1 and 10"),
    comments: z.string().optional(),
  })
  .refine(
    (data) => new Date(data.dateVisitedTo) > new Date(data.dateVisitedFrom),
    {
      message: "'Date Visited To' must be after 'Date Visited From'",
      path: ["dateVisitedTo"],
    }
  );
type UserInputFormSchemaType = z.infer<typeof UserInputFormSchema>;
type AddUserInputFormProps = {
  isEdit: false;
  defaultValues?: never;
};
type EditUserInputFormProps = {
  isEdit: true;
  defaultValues: UserInput;
};

function AddUserInputForm({
  isEdit,
  defaultValues,
}: AddUserInputFormProps | EditUserInputFormProps): JSX.Element {
  const [isAddUserInputSuccess, setIsAddUserInputSuccess] =
    useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserInputFormSchemaType>({
    defaultValues,
    resolver: zodResolver(UserInputFormSchema),
  });
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectUserInputsIsLoading);
  const error = useAppSelector(selectUserInputsError);
  const citizenshipMap = useAppSelector(selectCitizenships);
  useEffect(() => {
    if (isAddUserInputSuccess) {
      const timer = setTimeout(() => {
        setIsAddUserInputSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAddUserInputSuccess]);
  const navigate = useNavigate();
  if (citizenshipMap === null) {
    return <></>;
  }
  const onSubmit = async (data: UserInputFormSchemaType) => {
    if (!isEdit) {
      const addUserInput: AddUserInput = {
        country: citizenshipMap[data.country],
        dateVisitedFrom: data.dateVisitedFrom,
        dateVisitedTo: data.dateVisitedTo,
        foodRating: data.foodRating,
        hospitalRating: data.hospitalRating,
        climateRating: data.climateRating,
        tourismRating: data.tourismRating,
        safetyRating: data.safetyRating,
        costOfLivingRating: data.costOfLivingRating,
        cultureEntertainmentRating: data.cultureEntertainmentRating,
        infrastructureRating: data.infrastructureRating,
        healthcareRating: data.healthcareRating,
        comments: data.comments,
      };
      if (!isLoading) {
        try {
          await dispatch(postUserInput(addUserInput)).then((resultAction) => {
            if (postUserInput.fulfilled.match(resultAction)) {
              reset();
              setIsAddUserInputSuccess(true);
              dispatch(fetchUserInputs());
            } else {
              setIsAddUserInputSuccess(false);
            }
          });
        } catch (err) {
          setIsAddUserInputSuccess(false);
        }
      }
    } else {
      const editUserInput: EditUserInput = {
        userInputID: defaultValues.userInputID,
        country: citizenshipMap[data.country],
        foodRating: data.foodRating,
        hospitalRating: data.hospitalRating,
        climateRating: data.climateRating,
        tourismRating: data.tourismRating,
        safetyRating: data.safetyRating,
        costOfLivingRating: data.costOfLivingRating,
        cultureEntertainmentRating: data.cultureEntertainmentRating,
        infrastructureRating: data.infrastructureRating,
        healthcareRating: data.healthcareRating,
        comments: data.comments,
      };
      if (!isLoading) {
        try {
          await dispatch(putUserInput(editUserInput)).then((resultAction) => {
            if (putUserInput.fulfilled.match(resultAction)) {
              reset();
              setIsAddUserInputSuccess(true);
              dispatch(fetchUserInputs());
              navigate(dashboardFeedback);
            } else {
              setIsAddUserInputSuccess(false);
            }
          });
        } catch (err) {
          setIsAddUserInputSuccess(false);
        }
      }
    }
  };
  const onCancel = () => {
    reset();
    if (isEdit) {
      navigate(dashboardFeedback);
    }
  };

  return (
    <Form className="container mt-3 mb-3" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="h2">{isEdit ? "Edit Feedback" : "Add Feedback"}</h2>{" "}
      <Form.Group className="mb-3" controlId="country">
        <Form.Label>Country</Form.Label>
        <Form.Select
          {...register("country")}
          isInvalid={errors.country !== undefined}
        >
          <option value="">Select a country</option>
          {citizenshipMap &&
            Object.entries(citizenshipMap).map(([country, id]) => (
              <option key={id} value={country}>
                {country}
              </option>
            ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.country?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Row>
        <Form.Group as={Col} className="mb-3" controlId="dateVisitedFrom">
          <Form.Label>Date Visited From</Form.Label>
          <Form.Control
            type="date"
            {...register("dateVisitedFrom")}
            isInvalid={errors.dateVisitedFrom !== undefined}
            readOnly={isEdit}
          />
          <Form.Control.Feedback type="invalid">
            {errors.dateVisitedFrom?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="dateVisitedTo">
          <Form.Label>Date Visited To</Form.Label>
          <Form.Control
            type="date"
            {...register("dateVisitedTo")}
            isInvalid={errors.dateVisitedTo !== undefined}
            readOnly={isEdit}
          />
          <Form.Control.Feedback type="invalid">
            {errors.dateVisitedTo?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} className="mb-3" controlId="foodRating">
          <Form.Label>Food Rating (1-10)</Form.Label>
          <Form.Control
            type="number"
            {...register("foodRating", { valueAsNumber: true })}
            isInvalid={errors.foodRating !== undefined}
          />
          <Form.Control.Feedback type="invalid">
            {errors.foodRating?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="hospitalRating">
          <Form.Label>Hospital Rating (1-10)</Form.Label>
          <Form.Control
            type="number"
            {...register("hospitalRating", { valueAsNumber: true })}
            isInvalid={errors.hospitalRating !== undefined}
          />
          <Form.Control.Feedback type="invalid">
            {errors.hospitalRating?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="climateRating">
          <Form.Label>Climate Rating (1-10)</Form.Label>
          <Form.Control
            type="number"
            {...register("climateRating", { valueAsNumber: true })}
            isInvalid={errors.climateRating !== undefined}
          />
          <Form.Control.Feedback type="invalid">
            {errors.climateRating?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} className="mb-3" controlId="tourismRating">
          <Form.Label>Tourism Rating (1-10)</Form.Label>
          <Form.Control
            type="number"
            {...register("tourismRating", { valueAsNumber: true })}
            isInvalid={errors.tourismRating !== undefined}
          />
          <Form.Control.Feedback type="invalid">
            {errors.tourismRating?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="safetyRating">
          <Form.Label>Safety Rating (1-10)</Form.Label>
          <Form.Control
            type="number"
            {...register("safetyRating", { valueAsNumber: true })}
            isInvalid={errors.safetyRating !== undefined}
          />
          <Form.Control.Feedback type="invalid">
            {errors.safetyRating?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="costOfLivingRating">
          <Form.Label>Cost of Living Rating (1-10)</Form.Label>
          <Form.Control
            type="number"
            {...register("costOfLivingRating", { valueAsNumber: true })}
            isInvalid={errors.costOfLivingRating !== undefined}
          />
          <Form.Control.Feedback type="invalid">
            {errors.costOfLivingRating?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group
          as={Col}
          className="mb-3"
          controlId="cultureEntertainmentRating"
        >
          <Form.Label>Culture and Entertainment Rating (1-10)</Form.Label>
          <Form.Control
            type="number"
            {...register("cultureEntertainmentRating", { valueAsNumber: true })}
            isInvalid={errors.cultureEntertainmentRating !== undefined}
          />
          <Form.Control.Feedback type="invalid">
            {errors.cultureEntertainmentRating?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="infrastructureRating">
          <Form.Label>Infrastructure Rating (1-10)</Form.Label>
          <Form.Control
            type="number"
            {...register("infrastructureRating", { valueAsNumber: true })}
            isInvalid={errors.infrastructureRating !== undefined}
          />
          <Form.Control.Feedback type="invalid">
            {errors.infrastructureRating?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="healthcareRating">
          <Form.Label>Healthcare Rating (1-10)</Form.Label>
          <Form.Control
            type="number"
            {...register("healthcareRating", { valueAsNumber: true })}
            isInvalid={errors.healthcareRating !== undefined}
          />
          <Form.Control.Feedback type="invalid">
            {errors.healthcareRating?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Form.Group className="mb-3" controlId="comments">
        <Form.Label>Comments</Form.Label>
        <Form.Control
          as="textarea"
          {...register("comments")}
          isInvalid={errors.comments !== undefined}
        />
        <Form.Control.Feedback type="invalid">
          {errors.comments?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <div className="d-flex justify-content-end">
        <ButtonGroup>
          <Button className="w-100" type="submit">
            Submit
          </Button>
          <Button
            className="w-100"
            type="reset"
            variant="danger"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </div>
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
      {isAddUserInputSuccess && (
        <Alert className="mt-3 mb-3" variant="info">
          Feedback added successfully!
        </Alert>
      )}
    </Form>
  );
}

export default AddUserInputForm;
