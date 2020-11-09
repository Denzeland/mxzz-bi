import React from "react";
import routeWithUserSession from "@/components/ApplicationArea/routeWithUserSession";
import LeftDialog from "@/components/cold/LeftDialog";


function LeftDialogComponent(props) {
  const isToggleOn = props.isToggleOn;

  return (
    <div id="LeftDialog-container">
      <LeftDialog />
    </div>
  );

}


//LeftDialogComponent();

export default routeWithUserSession({

  path: "/cold/Left",
  title: "Cold",
  render: pageProps => <LeftDialogComponent {...pageProps} />,
});

//function LeftDialogPage() {
//  return (
//    <div className="LeftDialog-page">
//      <div className="container">{dashboard && <LeftDialogComponent dashboard={dashboard} />}</div>
//    </div>
//  );
//}
