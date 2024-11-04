import { component$, useSignal } from "@builder.io/qwik";
import {
  Link,
  routeAction$,
  routeLoader$,
  useLocation,
  useNavigate,
} from "@builder.io/qwik-city";
import { LuLogOut } from "@qwikest/icons/lucide";
import { eq } from "drizzle-orm";
import { Modal } from "~/components/modal/Modal";
import { db } from "~/lib/db/db";
import { appointment } from "~/lib/db/schema";
import { convertToCustomFormat } from "~/utils/convertToCustomFormat";

//load data in database
export const useAppointmentHistoryLoader = routeLoader$(async ({ params }) => {
  const res = await db.query.appointment.findFirst({
    columns: {
      id: true,
      dateTime: true,
      status: true,
      reasonOfAppointment: true,
      createdAt: true,
      comment: true,
      reasonOfAdmin: true,
      updatedAt: true,
    },
    with: {
      doctor: {
        columns: {
          name: true,
          image: true,
        },
      },
    },
    where: eq(appointment.id, Number(params.id)),
  });
  return {
    data: res,
  };
});
export const useLogoutAction = routeAction$(async (values, { cookie }) => {
  cookie.delete("auth-token", { path: "/" });

  return {
    success: true,
  };
});

export default component$(() => {
  const loader = useAppointmentHistoryLoader();
  const isOpen = useSignal<boolean>(false);
  const logoutAction = useLogoutAction();
  const nav = useNavigate();
  const { params } = useLocation();

  return (
    <>
      {/* Bubble background */}
      <img
        class="fixed -z-10 h-screen w-screen object-cover"
        src={"/backgroud_of_history.png"}
        alt="bg-history"
        width={0}
        height={0}
      />

      {/* big box */}
      <div class="flex min-h-screen justify-center">
        <div class="container mx-auto my-8 px-8 ">
          {/* header */}
          <nav class="flex w-full justify-between">
            {/* logo and name */}
            <div class="flex flex-col">
              <img width={84} height={54} src={"/logo_project.png"} alt="" />
              <span class="ml-1 text-sm font-semibold">SnatBas Clinic</span>
            </div>
          </nav>

          {/* session*/}
          <div class="mx-10 mt-10 flex-col space-y-3">
            {/* back to home button and appointment detail, created time */}
            <div class="mb-5 flex-col space-y-5">
              {/* back to home button */}
              <div>
                <Link
                  class="inline-flex cursor-pointer items-center gap-x-1 text-xl text-gray-800 hover:text-primary-600 focus:text-primary-600 focus:outline-none "
                  href={`/page_home_user/${params.accountId}/`}
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
              {/* text and created time */}
              <div class="flex justify-between">
                <span class="text-2xl">Appointment details</span>
                <div>{convertToCustomFormat(loader.value.data!.createdAt)}</div>
              </div>
            </div>

            {/* detail table */}
            <div class="flex flex-auto flex-row justify-center gap-5 rounded-2xl bg-cyan-100 p-4">
              {/* left */}
              <div class="w-full space-y-3 rounded-2xl bg-white p-2">
                {/* doctor */}
                <div class="flex items-center gap-2">
                  <div class="font-medium">Doctor: </div>
                  <img
                    src={
                      import.meta.env.PUBLIC_IMAGE_URL +
                      "/" +
                      loader.value.data?.doctor.image
                    }
                    alt={loader.value.data?.doctor.name}
                    class="size-4 rounded-full"
                    height={0}
                    width={0}
                  />
                  <div>{loader.value.data?.doctor.name}</div>
                </div>

                {/* date of appointment */}
                <div class=" flex gap-2">
                  <div class="font-medium">Date of appointment: </div>
                  <div>{loader.value.data?.dateTime}</div>
                </div>

                {/* Reason for appointment */}
                <div class="flex flex-col space-y-2">
                  <div class="mb-1 font-medium">Reason of appointment</div>
                  <div>
                    <textarea
                      class="h-24 w-full cursor-default resize-none rounded-lg border-gray-200 px-4 py-3"
                      value={loader.value.data?.reasonOfAppointment}
                      readOnly
                    ></textarea>
                  </div>
                </div>

                {/* additional comment/notes */}
                <div class="flex flex-col space-y-2">
                  <div class="font-medium">additional comment/notes</div>
                  <div>
                    <textarea
                      class="h-24 w-full cursor-default resize-none rounded-lg border-gray-200 px-4 py-3"
                      value={loader.value.data?.comment || ""}
                      readOnly
                      placeholder="No comment"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* right */}
              <div class="flex w-full flex-col space-y-3 rounded-2xl bg-white p-2">
                {/* status */}
                <div class="flex justify-end ">
                  {loader.value.data?.status === "cancelled" ? (
                    <span class="inline-flex items-center gap-x-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white">
                      <svg
                        width="14"
                        height="18"
                        viewBox="0 0 14 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.00501 7.50462V9.50306M7.00501 11.5015H7.01M11.8661 12.0011L7.86932 5.00655C7.78217 4.85278 7.65579 4.72487 7.50307 4.63588C7.35035 4.54689 7.17676 4.5 7.00001 4.5C6.82326 4.5 6.64967 4.54689 6.49695 4.63588C6.34423 4.72487 6.21785 4.85278 6.1307 5.00655L2.13389 12.0011C2.0458 12.1537 1.99961 12.3268 2 12.503C2.00039 12.6792 2.04735 12.8521 2.13611 13.0043C2.22488 13.1564 2.35229 13.2824 2.50544 13.3695C2.65859 13.4565 2.83204 13.5015 3.00819 13.5H11.0018C11.1771 13.4998 11.3493 13.4535 11.5011 13.3657C11.6528 13.2779 11.7788 13.1518 11.8664 12.9999C11.954 12.848 12 12.6758 12 12.5005C12 12.3252 11.9538 12.153 11.8661 12.0011Z"
                          stroke="#FEF2F2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      cancelled
                    </span>
                  ) : loader.value.data?.status === "scheduled" ? (
                    <span class="inline-flex items-center gap-x-1.5 rounded-full bg-teal-400 px-3 py-1.5 text-xs font-medium text-teal-800">
                      <svg
                        width="14"
                        height="18"
                        viewBox="0 0 14 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 6.25L4.5 11.75L2 9.25"
                          stroke="#006F51"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      scheduled
                    </span>
                  ) : (
                    <span class="inline-flex items-center gap-x-1.5 rounded-full bg-cyan-300 px-3 py-1.5 text-xs font-medium text-cyan-700">
                      <svg
                        width="15"
                        height="18"
                        viewBox="0 0 15 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.5 13H9.5M2.5 5H9.5M8.5 13V11.3312C8.49994 11.119 8.39455 10.9156 8.207 10.7656L6 9M6 9L3.793 10.7656C3.60545 10.9156 3.50006 11.119 3.5 11.3312V13M6 9L3.793 7.2344C3.60545 7.08441 3.50006 6.88096 3.5 6.6688V5M6 9L8.207 7.2344C8.39455 7.08441 8.49994 6.88096 8.5 6.6688V5"
                          stroke="#0E7790"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      pending
                    </span>
                  )}
                </div>

                {/* updatedAt */}
                <div class="flex justify-end">
                  <span class="mr-2 font-medium">Update date:</span>

                  {loader.value.data!.updatedAt
                    ? convertToCustomFormat(loader.value.data!.updatedAt)
                    : "in progress"}
                </div>

                {/* Reason for schedule */}
                <div class="space-y-2">
                  <span class="flex justify-end font-medium">
                    Reason for schedule
                  </span>
                  <div class="">
                    <textarea
                      class="h-60 w-full cursor-default resize-none rounded-lg border-gray-200 px-4 py-3"
                      readOnly
                      placeholder="please wait for confirmation"
                      value={loader.value.data?.reasonOfAdmin || ""}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            {/* Model pop-up of logout */}
            <Modal isOpen={isOpen}>
              <div class="my-5 flex flex-col items-center justify-center space-y-12">
                <div>
                  <LuLogOut class="size-20 text-red-500" />
                </div>
                <div>
                  <p class="text-2xl">Do you confirm to LOG OUT?</p>
                </div>
                <div class="space-x-14">
                  <button
                    type="button"
                    onClick$={() => {
                      isOpen.value = false;
                    }}
                    class="inline-flex h-11 w-28 items-center justify-center gap-x-2 rounded-full border border-transparent bg-red-500 px-4 py-3 text-sm font-medium text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick$={async () => {
                      const res = await logoutAction.submit();
                      console.log(res);

                      if (res.value.success) {
                        await nav("/log_in/");
                      }
                    }}
                    class="inline-flex h-11 w-28 items-center justify-center gap-x-2 rounded-full border border-transparent bg-gray-200 px-4 py-3 text-sm font-medium text-red-500 hover:bg-gray-300 focus:bg-gray-300  focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    disabled={logoutAction.isRunning}
                  >
                    Log out
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
});