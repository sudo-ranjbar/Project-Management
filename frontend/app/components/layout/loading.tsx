import { Loader2 } from "lucide-react";

const LoadingPage = () => {
    return ( 
        <div className="flex justify-center items-center h-full">
            <Loader2 className="w-20 h-20 animate-spin"/>
        </div>
     );
}
 
export default LoadingPage;