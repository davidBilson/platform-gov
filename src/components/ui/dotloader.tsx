import { ThreeDots } from "react-loader-spinner";

const DotLoader = ({ width, height}: { width?: string, height?: string }) => {
    return (
        <ThreeDots
            visible={true}
            height={height || "80"}
            width={width || "80"}
            color="#0B5F94"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
        />
    )
}

export default DotLoader