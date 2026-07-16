import os
import pandas as pd
from datetime import datetime

def get_atm_strike(spot_price: float, symbol: str) -> int:
    """
    Spot price-a vechi exact ATM strike price-a round off pandra function.
    """
    symbol = symbol.upper()
    
    # Ovvoru index-kkum ethana points interval nu set pandrom
    strike_steps = {
        "NIFTY": 50,
        "BANKNIFTY": 100,
        "FINNIFTY": 50,
        "SENSEX": 100
    }
    
    # Default-a Nifty (50) eduthukkum, illana antha symbol-oda step edukkum
    step = strike_steps.get(symbol, 50)
    
    # Nearest strike-kku round off pandrom
    atm_strike = round(spot_price / step) * step
    
    return int(atm_strike)


def get_option_file_path(trade_date, strike, option_type, base_dir=r"D:\nifty"):
    """
    Trade date-a vechi next expiry folder-a thedi, exact CSV file path-a return pannum.
    Format expected: {Strike}{Type}_{Expiry}.csv (Example: 21500CE_20240104.csv)
    """
    # Trade date-a string-la iruntha datetime object-ah convert pandrom
    if isinstance(trade_date, str):
        trade_date = pd.to_datetime(trade_date)
        
    # =========================================================================
    # 🚨 FIX: Remove Timezone info for folder date comparison to avoid Crash 🚨
    # =========================================================================
    if hasattr(trade_date, 'tzinfo') and trade_date.tzinfo is not None:
        trade_date = trade_date.tz_localize(None)
        
    try:
        # Base directory-la irukka ellam 'YYYYMMDD' folders-ayum eduthu sort pandrom
        folders = [f for f in os.listdir(base_dir) if f.isdigit() and len(f) == 8]
        folders.sort()
        
        # Trade date-kku apparam vara mudhal expiry folder-a kandupudikkirom
        selected_folder = None
        for folder in folders:
            folder_date = datetime.strptime(folder, "%Y%m%d")
            if folder_date >= trade_date:
                selected_folder = folder
                break
                
        if not selected_folder:
            print(f"Future expiry folder kedaikkavillai for date: {trade_date}")
            return None
            
        # CSV file name-a construct pandrom (Example: "21500CE_20240104.csv")
        file_name = f"{strike}{option_type.upper()}_{selected_folder}.csv"
        
        # Folder path matrum file name-a join pandrom
        full_path = os.path.join(base_dir, selected_folder, file_name)
        
        # Safety Check: File unmaiyilave antha path-la irukka nu check pandrom
        if not os.path.exists(full_path):
            print(f"Warning: File not found -> {full_path}")
            return None
            
        return full_path
        
    except Exception as e:
        print(f"Directory mapping error: {e}")
        return None