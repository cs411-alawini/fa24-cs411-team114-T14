import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppDispatch } from "../../app/hooks";
import { fetchAverageClimateRatings } from "../../services/ranking/RankingSlice";

const AverageClimateRatingFormSchema = z
  .object({
    dateVisitedFrom: z.string().date("Date visited from is required"),
    dateVisitedTo: z.string().date("Date visited to is required"),
  })
  .refine(
    (data) => new Date(data.dateVisitedTo) > new Date(data.dateVisitedFrom),
    {
      message: "'Date Visited To' must be after 'Date Visited From'",
      path: ["dateVisitedTo"],
    }
  );
type AverageClimateRatingFormSchemaType = z.infer<
  typeof AverageClimateRatingFormSchema
>;

function AverageClimateRatingForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AverageClimateRatingFormSchemaType>({
    resolver: zodResolver(AverageClimateRatingFormSchema),
  });
  const dispatch = useAppDispatch();

  const onSubmit = async (data: AverageClimateRatingFormSchemaType) => {
    await dispatch(fetchAverageClimateRatings(data));
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Form.Group as={Col} className="mb-3" controlId="dateVisitedFrom">
          <Form.Label>Date Visited From</Form.Label>
          <Form.Control
            type="date"
            {...register("dateVisitedFrom")}
            isInvalid={errors.dateVisitedFrom !== undefined}
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
          />
          <Form.Control.Feedback type="invalid">
            {errors.dateVisitedTo?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Button className="w-100" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default AverageClimateRatingForm;
