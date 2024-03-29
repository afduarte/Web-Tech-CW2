-- GET Info needed to render the page
SELECT
  -- CAM_SMO Fields
  CAM_SMO.SPR_CODE,
  CAM_SMO.MOD_CODE, 
  CAM_SMO.AYR_CODE, 
  CAM_SMO.PSL_CODE,
  -- INS_MOD Fields 
  INS_MOD.MOD_NAME, 
  INS_MOD.PRS_CODE,
  -- INS_PRS Fields
  INS_PRS.PRS_FNM1, 
  INS_PRS.PRS_SURN,
  -- INS_SPR Fields
  INS_SPR.SPR_FNM1,
  INS_SPR.SPR_SURN
FROM 
  CAM_SMO 
  JOIN INS_MOD ON CAM_SMO.MOD_CODE = INS_MOD.MOD_CODE
  JOIN INS_SPR ON CAM_SMO.SPR_CODE = INS_SPR.SPR_CODE
  JOIN INS_PRS ON INS_MOD.PRS_CODE = INS_PRS.PRS_CODE
WHERE CAM_SMO.SPR_CODE = '50200036';

-- Get Question info
SELECT 
  QUE_CODE, 
  QUE_NAME, 
  QUE_TEXT, 
  CAT_NAME, 
  INS_QUE.CAT_CODE
FROM 
  INS_QUE 
  JOIN INS_CAT ON INS_QUE.CAT_CODE=INS_CAT.CAT_CODE;

-- Get previous answer
SELECT QUE_CODE, MOD_CODE, RES_VALU FROM INS_RES where SPR_CODE='50200036';

-- UPDATE for student
INSERT INTO INS_RES 
  (SPR_CODE,MOD_CODE,AYR_CODE,PSL_CODE,QUE_CODE,RES_VALU) 
  VALUES ('50200036','INF08104','2016/7','TR1','1.1',1)
ON DUPLICATE KEY 
UPDATE 
  SPR_CODE = VALUES(SPR_CODE), 
  MOD_CODE = VALUES(MOD_CODE), 
  AYR_CODE = VALUES(AYR_CODE), 
  PSL_CODE = VALUES(PSL_CODE), 
  QUE_CODE = VALUES(QUE_CODE), 
  RES_VALU = VALUES(RES_VALU);


  -- q test query
  SELECT * FROM INS_RES
  WHERE
  SPR_CODE = '50200036' AND
  MOD_CODE = 'INF08104' AND
  AYR_CODE = '2016/7' AND
  PSL_CODE = 'TR1' AND
  QUE_CODE = '1.1';

-- Get average score per question per module
-- To get average per module, remove QUE_CODE from group by and select
SELECT QUE_CODE, MOD_CODE, AVG(RES_VALU) 
FROM INS_RES 
WHERE MOD_CODE IN ('CSN08101', 'SET09103') 
GROUP BY QUE_CODE, MOD_CODE;

-- Same as above but add min and max for each question
SELECT QUE_CODE, MOD_CODE, AVG(RES_VALU), MIN(RES_VALU), MAX(RES_VALU) 
FROM INS_RES 
WHERE MOD_CODE IN ('CSN08101', 'SET09103') 
GROUP BY MOD_CODE, QUE_CODE;

-- Full aggregate, percentage of answer above 4
SELECT 100*AVG(CASE WHEN  RES_VALU >= 4 THEN 1 ELSE 0 END) AS VALUE
FROM INS_RES 
WHERE MOD_CODE='CSN08101'

-- Get average response by category
SELECT INS_CAT.CAT_CODE, MOD_CODE, AVG(RES_VALU) AS VAL 
FROM INS_RES 
JOIN INS_QUE ON INS_RES.QUE_CODE=INS_QUE.QUE_CODE 
JOIN INS_CAT ON INS_QUE.CAT_CODE=INS_CAT.CAT_CODE
WHERE MOD_CODE IN ('CSN08101')
GROUP BY CAT_CODE, MOD_CODE;