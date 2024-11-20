export type Coupon = {
    id?: string;                
    name: string;               
    description: string;        
    discount_amount: number;    
    min_order_value: number;    
    usage_limit: number;        
    is_active: boolean;         
    start_date: string;         
    end_date: string;           
    created_at?: string;        
    updated_at?: string;        
    deleted_at?: string | null; 
};

export type CouponInput = {
    name: string;                
    description?: string;        
    discount_amount: number;     
    min_order_value: number;     
    usage_limit: number;         
    is_active: boolean;          
    start_date: string;          
    end_date: string;            
};
