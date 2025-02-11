/** ไอดีขององค์ประกอบ Canvas */
type CanvasElementId = string;
declare class OpencvQr {
    /** การวิเคราะห์ภาพ */
    private qrImage;
    private qrVec;
    /** ผลการจดจำ */
    private qrRes;
    /** จำนวนผลการจดจำ */
    qrSize: number;
    private qrcode_detector?;
    cv?: any;
    ready: Promise<void>;
    constructor(models: {
        /** ที่อยู่ไฟล์โมเดล detect.caffemodel */
        dw: string;
        /** ที่อยู่ไฟล์โมเดล sr.caffemodel */
        sw: string;
    });
    init(cv: any, models: any): Promise<void>;
    private string2ArrayBuffer;
    private res2ArrayBuffer;
    private getImageData;
    private checkInit;
    /**
     * โหลดภาพ
     * @param imageData canvasDom Id หรือองค์ประกอบ Canvas หรือองค์ประกอบ Image หรือ ImageData
     * @returns
     */
    load(imageData: CanvasElementId | HTMLCanvasElement | HTMLImageElement | ImageData): this | undefined;
    /**
     * ส่งคืนข้อมูล QR code ที่จดจำได้
     */
    getInfos(): string[];
    /**
     * ส่งคืนข้อมูลภาพ QR code ที่จดจำได้
     */
    getImages(): ImageData[];
    /**
     * ส่งคืนข้อมูลตำแหน่งของภาพ QR code ที่จดจำได้เทียบกับภาพต้นฉบับ รวมถึงพิกัดและขนาด
     */
    getSizes(): {
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
    /**
     * ล้างข้อมูลที่โหลดและปล่อยหน่วยความจำ
     */
    clear(): void;
}
export default OpencvQr;
