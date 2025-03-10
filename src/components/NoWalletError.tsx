export default function NoWalletError() {
  return (
    <section className="w-full min-h-screen h-max bg-gray-900 flex flex-col gap-4 p-6 md:py-8 md:px-10">
      <p className="text-white font-semibold text-3xl text-center">
        Please connect wallet!
      </p>
    </section>
  );
}
