import { component$, useSignal } from "@builder.io/qwik";
import background_of_history from "/backgroud_of_history.png";
import logo_image from "/logo project.png";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { LuUser } from "@qwikest/icons/lucide";

export default component$(() => {
  const isOpen = useSignal<boolean>(false);
  const nav = useNavigate();
  const { params } = useLocation();
  return (
    <>
      {/* Bubble background */}
      <img
        class="fixed -z-10 h-screen w-screen object-cover"
        src={background_of_history}
        alt="bg-history"
        width={0}
        height={0}
      />

      {/* big box */}
      <div class="flex h-screen justify-center">
        <div class="container">
          {/* header */}
          <nav class="mt-8 flex w-full justify-between">
            {/* logo and name */}
            <div class="flex-none">
              <img width={84} height={54} src={logo_image} alt="" />
              <span class="ml-1 text-sm font-semibold">SnatBas Clinic</span>
            </div>
            {/* link */}

            <ul class="flex items-center gap-16">
              <li>
                <Link href="#">Home</Link>
              </li>
              <li>
                <Link href="#">My form</Link>
              </li>
              <li>
                <Link href="#">Contact us</Link>
              </li>
              <li class="flex items-center gap-1">
                <LuUser class="size-5" />
                <Link
                  href="#"
                  onClick$={() => {
                    isOpen.value = true;
                  }}
                >
                  Log out
                </Link>
              </li>
            </ul>
          </nav>

          {/* session*/}
          <div class="mx-10 mt-10 flex-col">
            {/* back to home button and appointment detail, created time */}
            <div class="flex justify-between ">
              {/* back to home button */}
              <div class="flex gap-2">
                <Link
                  class=""
                  onClick$={() => {
                    nav(`/page_home_user/${params.accountId}`);
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
                <span class="text-2xl">Appointment details</span>
              </div>
              {/* created time */}
              <div class="text-lg">
                create time wait for accessing data from database{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
