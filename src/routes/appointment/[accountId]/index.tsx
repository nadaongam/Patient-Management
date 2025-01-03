import { component$, useSignal } from "@builder.io/qwik";
import {
  Link,
  routeLoader$,
  useLocation,
  useNavigate,
} from "@builder.io/qwik-city";
import { formAction$, setValue, useForm, valiForm$ } from "@modular-forms/qwik";
import { LuCheckCircle } from "@qwikest/icons/lucide";
import { Button } from "~/components/button/Button";
import { AdvancedSelect } from "~/components/forms/advanced-select/AdvancedSelect";
import { TextInput } from "~/components/forms/text-input/TextInput";
import { Textarea } from "~/components/forms/textarea/Textarea";
import { Modal } from "~/components/modal/Modal";
import { db } from "~/lib/db/db";
import appointment from "../action/appointment";
import type { IAppointmentSchema } from "../schema/appointment";
import { AppointmentSchema } from "../schema/appointment";

export const useDoctorLoader = routeLoader$(async () => {
  return await db.query.doctor.findMany({
    columns: {
      id: true,
      name: true,
      image: true,
    },
  });
});

export const useAppointmentAction = formAction$<
  IAppointmentSchema,
  { success: boolean; message: string; id?: number }
>(async (values, { params }) => {
  try {
    const res = await appointment(values, Number(params.accountId));

    return {
      data: {
        success: true,
        message: "Appointment successfully!",
        id: res,
      },
    };
  } catch (error) {
    return {
      data: {
        success: false,
        message: (error as Error).message,
      },
    };
  }
}, valiForm$(AppointmentSchema));

export default component$(() => {
  const loader = useDoctorLoader();
  const action = useAppointmentAction();
  const isOpen = useSignal<boolean>(false);
  const nav = useNavigate();
  const { params } = useLocation();

  const [form, { Field, Form }] = useForm<IAppointmentSchema>({
    loader: {
      value: {
        reasonOfAppointment: "",
        dateTime: "",
        doctorId: 0,
        comment: "",
      },
    },
    validate: valiForm$(AppointmentSchema),
  });

  return (
    <Form
      onSubmit$={async (values) => {
        const res = await action.submit(values);

        if (res.value.response.data?.success) {
          isOpen.value = true;
        }
      }}
    >
      <img
        class="fixed h-screen w-screen object-cover"
        src={"/background_appointment.jpg"}
        alt=""
        width={0}
        height={0}
      />
      <div class="relative flex flex-col justify-center">
        <div class="container mx-auto my-8 px-8">
          <div class="mb-4 flex flex-col">
            <img src={"/logo_project.png"} width={84} height={54} />
            <span class="ml-1 text-sm font-semibold">SnatBas Clinic</span>
          </div>
          <div>
            <Link
              class="mb-4 ml-10 inline-flex items-center gap-x-1  hover:cursor-pointer hover:text-primary-600 focus:text-primary-600 focus:outline-none "
              onClick$={async () => {
                nav(`/page_home_user/${params.accountId}/`);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-circle-arrow-left"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M16 12H8" />
                <path d="m12 8-4 4 4 4" />
              </svg>
              Back
            </Link>
          </div>
          <div class="mx-10">
            <h1 class="mb-4 text-3xl">Hey There 👋</h1>
            <p class="mb-6 text-gray-500">
              Request a new appointment in 10 seconds
            </p>
            <div class="w-full max-w-screen-lg rounded-lg bg-gray-50 p-8 text-black">
              <div class="mb-4">
                {/* Dropdown */}
                <Field name="doctorId" type="number">
                  {(field, props) => (
                    <AdvancedSelect
                      name={props.name}
                      options={loader.value.map(({ id, name, image }) => ({
                        label: name,
                        value: id,
                        img: import.meta.env.PUBLIC_IMAGE_URL + "/" + image,
                      }))}
                      onSelected$={(val) => {
                        setValue(
                          form,
                          "doctorId",
                          typeof val === "number" ? val : val[0],
                        );
                      }}
                      value={field.value}
                      error={field.error}
                      placeholder="Select your doctor"
                      required
                      label="Doctor"
                    />
                  )}
                </Field>

                <br />
                {/* textarea */}
                <div class="flex flex-row space-x-6">
                  <div class="flex-1">
                    <Field name="reasonOfAppointment">
                      {(field, props) => (
                        <Textarea
                          {...props}
                          value={field.value}
                          error={field.error}
                          label="Reason for appointment"
                          placeholder="ex: Annual monthly check-up"
                          size="large"
                        />
                      )}
                    </Field>
                  </div>

                  <div class="flex-1">
                    <Field name="comment">
                      {(field, props) => (
                        <Textarea
                          {...props}
                          value={field.value}
                          error={field.error}
                          label="Additional comments/notes"
                          placeholder="ex: Prefer afternoon appointments, if possible"
                          size="large"
                        />
                      )}
                    </Field>
                  </div>
                </div>
                <br />

                <Field name="dateTime">
                  {(field, props) => (
                    <TextInput
                      {...props}
                      value={field.value}
                      error={field.error}
                      label="Expected appointment date"
                      type="datetime-local"
                    />
                  )}
                </Field>
                <br />

                <Button
                  block
                  variant="solid"
                  type="submit"
                  isLoading={action.isRunning}
                >
                  Submit and continue
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={isOpen}>
          <div class="flex w-full flex-col gap-3 p-10 text-center">
            <div class="flex items-center justify-center">
              <LuCheckCircle font-size="70px" class="text-green-600" />
            </div>
            <p class="text-wrap px-10 text-2xl font-medium">
              {" "}
              Your <span class=" text-green-700">appointment request</span> has
              been submitted completely!
            </p>
            <p class="px-10 text-lg text-gray-500">
              We'll be in touch shortly to confirm.
            </p>

            <Button
              block
              type="button"
              variant="solid"
              onClick$={async () => {
                await nav(`/page_home_user/${params.accountId}/`);
              }}
            >
              Confirm
            </Button>
          </div>
        </Modal>
      </div>
    </Form>
  );
});
